import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import {
  DefaultButton,
  Label,
  PrimaryButton,
  Stack
} from "office-ui-fabric-react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import uniqid from "uniqid";

import Calendar from "../components/CalendarField";

import PeopleEditor from "../components/PeopleEditor";
import EditableTextfield from "../components/EditableTextfield";
import APIS from "../../constants/methods";

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

const Editor = ({ columns, record, history }) => {
  const classes = useStyles();
  console.log("props history", history);

  let initRecord = {};
  columns.forEach(column => {
    if (column.type === "people") {
      initRecord[column.field] = [
        {
          _id: uniqid(),
          role: "parent",
          isNew: true,
        },
        {
          _id: uniqid(),
          role: "parent",
          isNew: true,
        },
        {
          _id: uniqid(),
          role: "child",
          isNew: true,
        },
      ]
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
    setFullRecord(oldValues => ({
      ...oldValues,
      [fieldId]: array
    }));
  };


  const saveRecord = () => {
    Meteor.call(APIS.RECORD_API.INSERT, fullRecord);
    history.goBack();
  };

  console.log("edit page state:::", fullRecord);

  return (
    <React.Fragment>
      <div className="modal--editor__container">
        <Stack horizontal>
          <Label styles={titleStyles}>{editorTitle}</Label>
          <PrimaryButton
            text="x"
            onClick={() => history.goBack()}
          ></PrimaryButton>
        </Stack>

        {columns.map(column => {
          let valueComp;
          if (!record) {
            // New record
            if (column.type === "string") {
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
            }
          } else {
            if (column.type === "string") {
              valueComp = (
                <EditableTextfield
                  value={record && record[column.field]}
                  isNew={!record}
                ></EditableTextfield>
              );
            } else if (column.type === "date") {
              // TODO -- need to double check once records is up.
              valueComp = (
                <Calendar
                  selectedDate={record && record[column.field]}
                  onDateSubmit={updateDateField(column.field)}
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

        {!record && (
          <Stack horizontal horizontalAlign="end" styles={buttonBarStyles}>
            <PrimaryButton onClick={saveRecord}>Save</PrimaryButton>
            <DefaultButton>Cancel</DefaultButton>
          </Stack>
        )}
      </div>
    </React.Fragment>
  );
};

const TrackedEditor = withTracker(() => {
  const columns = Meteor.settings.public.RECORD_TEMPLATE;
  return {
    columns
  };
})(Editor);

// Router history setup.
export default withRouter(({ history }) => <TrackedEditor history={history} />);
