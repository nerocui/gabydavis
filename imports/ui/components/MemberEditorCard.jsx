import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";

import Calendar from "../components/CalendarField";

const useStyles = makeStyles(theme => ({
  card: {
    width: '17rem',
    height: '14rem',
  },
  label: {
    paddingTop: '1rem',
  },
  row: {
    marginTop: '0.5rem',
    height: '2.5rem',
  },
  footer: {
    marginTop: '0.5rem',
  },
}));

const footerButtonStyle = {
  root: {
    'float': 'right',
    'margin-left': '0.5rem',
  }
}

const MemberEditorCard = ({member, columns, onDoneEdit, onDelete}) => {
  const classes = useStyles();

  const [person, setPerson] = React.useState({});
  const [editing, setEditing] = React.useState(false);

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
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  }

  const editMember = () => {
    setPerson(member);
    setEditing(true);
  }

  const deleteMember = () => {
    onDelete(member)
  }

  let cardContent;
  if (editing || member.isNew) {
    cardContent = (
      <CardContent>
        <Typography variant="h6">{member.role}</Typography>
        
        {columns.map(column => {
          if (column.type === "string" && column.field !== "role") {
            return (
              <Grid container key={column.field}>
                <Grid item xs={6} className={classes.label}>{column.display_name}</Grid>
                <Grid item xs={6}>
                  <TextField margin="dense" onChange={updatePerson(column.field)} value={person[column.field]} />
                </Grid>
              </Grid>
            );
          } else if (column.type === "date") {
            return (
              <Grid container key={column.field}>
                <Grid item xs={5} className={classes.label}>{column.display_name}</Grid>
                <Grid item xs={7}>
                  <Calendar                    
                    selectedDate={person && person[column.field]}
                    onDateSubmit={updateDateField(column.field)}
                  />
                </Grid>
              </Grid>
            );
          } else {
            return "";
          }
        })}

        <div className={classes.footer}>
          <PrimaryButton onClick={doneEdit} styles={footerButtonStyle}>Done</PrimaryButton>
          {editing && <DefaultButton onClick={cancelEdit} styles={footerButtonStyle}>Cancel</DefaultButton>}
        </div>
      </CardContent>
    );
  } else {
    cardContent = (
      <CardContent>
        <Box display="flex">
          <Box display="flex" flexGrow={1}>
            <Typography variant="h6">{member.role}</Typography>
          </Box>
          <IconButton size="small" onClick={editMember}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={deleteMember}>
            <ClearIcon />
          </IconButton>
        </Box>
        
        {columns.map(column => {
          if (column.type === "string" && column.field !== "role") {
            return (
              <Grid container key={column.field} className={classes.row}>
                <Grid item xs={6}>{column.display_name}</Grid>
                <Grid item xs={6}>{member[column.field]}</Grid>
              </Grid>
            );
          } else if (column.type === "date") {
            return (
              <Grid container key={column.field} className={classes.row}>
                <Grid item xs={6}>{column.display_name}</Grid>
                <Grid item xs={6}>{member[column.field] && new Date(member[column.field]).toDateString()}</Grid>
              </Grid>
            );
          } else {
            return "";
          }
        })}

      </CardContent>
    );
  }

  return (
    <Card className={classes.card}>
      {cardContent}
    </Card>
  );
};


export default withTracker(() => {
  const columns = Meteor.settings.public.PERSON_TEMPLATE;
  return {
    columns
  };
})(MemberEditorCard);