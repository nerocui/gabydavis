import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { ReactBingmaps } from "react-bingmaps";
import { connect } from "react-redux";
import {
  DefaultButton,
  Label,
  PrimaryButton,
  Stack,
  Toggle
} from "office-ui-fabric-react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import uniqid from "uniqid";

import Calendar from "../components/CalendarField";

import PeopleEditor from "../components/PeopleEditor";
import EditableTextfield from "../components/EditableTextfield";
import APIS from "../../constants/methods";
import key_id from "../../constants/key_id";

const useStyles = makeStyles(theme => ({
  textField: {
    padding: 3
  }
}));

const titleStyles = {
  root: {
    "font-size": "1.5rem",
    "flex-grow": 1
  }
};
const labelStyle = {
  root: {
    "font-size": "1.1rem",
    width: "11rem",
    "padding-top": "1rem"
  }
};
const buttonBarStyles = {
  root: {
    margin: "2rem"
  }
};
const topStackStyles = {
  root: {
    "margin-left": "2rem",
    "margin-right": "2rem",
    "margin-top": "1rem",
  }
};
const bottomStackStyles = {
  root: {
    "margin-left": "2rem",
    "margin-right": "2rem",
    "margin-bottom": "2rem",
  }
};

function mapStateToProps(state) {
  return {
    keys: state.KeyState.keys
  };
}

const Editor = ({ columns, history, keys, isMapEnabled }) => {
  const classes = useStyles();

  const record = history.location.state ? history.location.state.record : null;

  let bingApi = null;
  let boundary = null;

  if (keys) {
    bingApi = keys.filter(key => key._id === key_id.BING_MAP)[0].value;
  }

  let initRecord = record ? { ...record } : {};
  columns.forEach(column => {
    if (column.type === "people") {
      initRecord[column.field] = [
        {
          _id: uniqid(),
          role: "parent",
          isNew: true
        },
        {
          _id: uniqid(),
          role: "parent",
          isNew: true
        },
        {
          _id: uniqid(),
          role: "child",
          isNew: true
        }
      ];
    } else {
      initRecord[column.field] = "";
    }
  });

  const [fullRecord, setFullRecord] = React.useState(initRecord);
  const editorTitle = record ? "Details" : "New Record";

  const updateField = fieldId => event => {
    const value = event.target.value;
    setFullRecord(oldValues => ({
      ...oldValues,
      [fieldId]: value
    }));
  };

  // Updated date specifically, since onChange in CalendarField returns the date value instead of event handler.
  const updateDateField = fieldId => date => {
    setFullRecord(oldValues => ({
      ...oldValues,
      [fieldId]: date
    }));
  };
  const updateArrayField = fieldId => array => {
    const child = array.find(p => p.role === "child" && !p.isNew);
    const childId = child ? child._id : "";

    setFullRecord(oldValues => ({
      ...oldValues,
      [fieldId]: array,
      child_id: childId
    }));
  };

  const updateBooleanField = fieldId => (ev, checked) => {
    setFullRecord(oldValues => ({
      ...oldValues,
      [fieldId]: checked
    }));
  };

  const saveStringField = (fieldID, objectID) => stringToSave => {
    Meteor.call(APIS.RECORD_API.MODIFY, objectID, fieldID, stringToSave);
    // save the single change to Meteor here
    // modify takes (_id, field, value);
  };

  const saveRecord = () => {
    Meteor.call(APIS.RECORD_API.INSERT, fullRecord);
    history.push("/");
  };


  if (record) {
    boundary = {
      search: `${record.street_address}, ${record.city}, ${record.postal_code}`,
      option: {
        entityType: "PopulatedPlace"
      },
      polygonStyle: {
        fillColor: "rgba(255, 255, 255, 0)",
        strokeColor: "#a495b2",
        strokeThickness: 2
      }
    };
  }

  return (
      <div className="page--inner__container">
        <Stack horizontal styles={topStackStyles}>
          <Label styles={titleStyles}>{editorTitle}</Label>
          <DefaultButton
            text="Back"
            onClick={() => history.goBack()}
          ></DefaultButton>
        </Stack>

        {record && bingApi && isMapEnabled && (
          <div className="heroMap">
            <ReactBingmaps
              bingmapKey={bingApi}
              center={[13.0827, 80.2707]}
              mapTypeId={"road"}
              navigationBarMode={"compact"}
              boundary={boundary}
              style={{ height: "100%" }}
            />
          </div>
        )}

        <Stack styles={bottomStackStyles}>
        {columns.map(column => {
          let valueComp;
          if (!record) {
            // New record
            if (column.type === "string" || column.type === "note") {
              valueComp = (
                <TextField
                  variant="outlined"
                  onChange={updateField(column.field)}
                  margin="dense"
                  value={fullRecord[column.field]}
                />
              );
            } else if (column.type === "date") {
              valueComp = (
                <Calendar
                  selectedDate={new Date()}
                  onDateSubmit={updateDateField(column.field)}
                />
              );
            } else if (column.type === "people") {
              valueComp = (
                <PeopleEditor
                  people={fullRecord[column.field]}
                  onChange={updateArrayField(column.field)}
                />
              );
            } else if (column.type === "boolean") {
              valueComp = (
                <Toggle
                  onText="True"
                  onChange={updateBooleanField(column.field)}
                />
              );
            }
          } else {
            console.log("objectID:::", record.objectID);
            if (column.type === "string" || column.type === "note") {
              valueComp = (
                <EditableTextfield
                  value={record[column.field] || " "}
                  isNew={!record}
                  onValueSubmit={saveStringField(column.field, record.objectID)}
                />
              );
            } else if (column.type === "date") {
              // TODO -- need to double check once records is up.
              valueComp = (
                <Calendar
                  selectedDate={record && record[column.field]}
                  // onDateSubmit={updateDateField(column.field)}
                />
              );
            } else if (column.type === "people") {
              valueComp = (
                <PeopleEditor
                  people={record[column.field]}
                  // onChange={updateArrayField(column.field)}
                />
              );
            } else if (column.type === "boolean") {
              valueComp = (
                <Toggle
                  defaultChecked={
                    record[column.field] ? record[column.field] : false
                  }
                  onText="True"
                  // onChange={updateBooleanField(column.field)}
                />
              );
            }
          }

          return (
            <React.Fragment key={column.field}>
              <Stack horizontal>
                <Label styles={labelStyle}>{column.display_name}</Label>
                {valueComp}
              </Stack>
            </React.Fragment>
          );
        })}
        </Stack>

        {!record && (
          <Stack horizontal horizontalAlign="end" styles={buttonBarStyles}>
            <PrimaryButton onClick={saveRecord}>Save</PrimaryButton>
            <DefaultButton onClick={() => history.goBack()}>Cancel</DefaultButton>
          </Stack>
        )}
      </div>
  );
};

const TrackedEditor = withTracker(() => {
  const columns = Meteor.settings.public.RECORD_TEMPLATE;
  const features = Meteor.settings.public.FEATURE_FLAGS;
  const isMapEnabled = features.filter(feature => feature.id === "USE_MAP")[0]
    .enabled;
  return {
    isMapEnabled,
    columns
  };
})(Editor);

const ConnectedEditor = connect(mapStateToProps)(TrackedEditor);

// Router history setup.
export default withRouter(({ history }) => (
  <ConnectedEditor history={history} />
));
