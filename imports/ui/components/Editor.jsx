import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Label, PrimaryButton, Stack } from "office-ui-fabric-react";

import EditableTextfield from "./EditableTextfield";

const titleStyles = {
  root: {
    'font-size': '1.5rem',
    'flex-grow': 1
  }
}
const labelStyle = {
  root: {
    'font-size': '1.1rem',
    width: '11rem'
  }
}

const Editor = ({ columns, record, closeModal }) => {
  return (
    <React.Fragment>
      <div className="modal--editor__container">
        <Stack horizontal>
          <Label styles={titleStyles}>Details</Label>
          <PrimaryButton text="x" onClick={closeModal}></PrimaryButton>
        </Stack>
        
        {columns.map(column => {
          let valueComp;
          if (column.type === "string") {
            valueComp = (<EditableTextfield text={record && record[column.field]}></EditableTextfield>);
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
