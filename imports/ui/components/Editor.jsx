import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { DefaultButton, Label, PrimaryButton, Stack } from "office-ui-fabric-react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';

import EditableTextfield from "./EditableTextfield";
import APIS from '../../constants/methods';

const useStyles = makeStyles(theme => ({
  textField: {
    padding: 3,
  },

}));

const titleStyles = {
  root: {
    'font-size': '1.5rem',
    'flex-grow': 1
  }
}
const labelStyle = {
  root: {
    'font-size': '1.1rem',
    width: '11rem',
    'padding-top': '1rem',
  }
}
const buttonBarStyles = {
  root: {
    margin: '2rem'
  }
}

const Editor = ({ columns, record, closeModal }) => {
  const classes = useStyles();

  let initRecord = {}
  columns.forEach(column => {
    initRecord[column.field] = "";
  })
  const [fullRecord, setFullRecord] = React.useState(initRecord);

  const editorTitle = record ? "Details" : "New Record";

  const updateField = fieldId => event => {
    const value = event.target.value;
    setFullRecord(oldValues => ({
      ...oldValues,
      [fieldId]: value,
    }));
  };

  const saveRecord = () => {
    Meteor.call(APIS.RECORD_API.INSERT, fullRecord);
    closeModal();
  };

  return (
    <React.Fragment>
      <div className="modal--editor__container">
        <Stack horizontal>
          <Label styles={titleStyles}>{editorTitle}</Label>
          <PrimaryButton text="x" onClick={closeModal}></PrimaryButton>
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
                  value={fullRecord[column.field]} />
              )
            }
          } else {
            if (column.type === "string") {
              valueComp = (<EditableTextfield value={record && record[column.field]} isNew={!record}></EditableTextfield>);
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

        {!record && 
          (<Stack horizontal horizontalAlign="end" styles={buttonBarStyles}>
            <PrimaryButton onClick={saveRecord}>Save</PrimaryButton>
            <DefaultButton>Cancel</DefaultButton>
          </Stack>)}
      </div>
    </React.Fragment>
  );
};

export default withTracker(() => {
  const columns = Meteor.settings.public.RECORD_TEMPLATE;
  return {
    columns
  };
})(Editor);
