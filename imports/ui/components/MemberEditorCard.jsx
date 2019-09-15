import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import {PrimaryButton} from "office-ui-fabric-react";

import Calendar from "../components/CalendarField";

const useStyles = makeStyles(theme => ({
  card: {
    width: '17rem',
    height: '14rem',
  },
  label: {
    paddingTop: '1rem',
  }

}));

const doneButtonStyle = {
  root: {
    'margin-top': '1rem',
    'margin-left': '10rem',
  }
}

const MemberEditorCard = ({member, columns, onDoneEdit}) => {
  const classes = useStyles();

  const [person, setPerson] = React.useState({});

  const updatePerson = fieldId => event => {
    const value = event.target.value;
    setPerson(oldValues => ({
      ...oldValues,
      [fieldId]: value,
    }));
  };

  const updateDateField = fieldId => value => {
    setPerson(oldValues => ({
      ...oldValues,
      [fieldId]: value,
    }))
  }

  const doneEdit = () => {
    const newPerson = {
      _id: member._id,
      role: member.role,
      ...person,
    }
    onDoneEdit(newPerson);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{member.role}</Typography>
        
        {columns.map(column => {
          if (column.type === "string" && column.field !== "role") {
            return (
              <Grid container key={column.field}>
                <Grid item xs={6} className={classes.label}>{column.display_name}</Grid>
                <Grid item xs={6}>
                  <TextField margin="dense" onChange={updatePerson(column.field)}></TextField>
                </Grid>
              </Grid>
            );
          } else if (column.type === "date") {
            return (
              <Grid container key={column.field}>
                <Grid item xs={6} className={classes.label}>{column.display_name}</Grid>
                <Grid item xs={6}>
                  <Calendar                    
                    selectedDate={member && member[column.field]}
                    onDateSubmit={updateDateField(column.field)}
                  />
                </Grid>
              </Grid>
            );
          } else {
            return "";
          }
        })}

        <PrimaryButton onClick={doneEdit} styles={doneButtonStyle}>Done</PrimaryButton>
      </CardContent>
    </Card>
  );
};


export default withTracker(() => {
  const columns = Meteor.settings.public.PERSON_TEMPLATE;
  return {
    columns
  };
})(MemberEditorCard);