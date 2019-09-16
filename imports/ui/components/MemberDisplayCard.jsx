import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    width: '17rem',
    height: '14rem',
  },
  row: {
    marginTop: '0.5rem',
    height: '2.5rem',
  },
}));

const MemberDisplayCard = ({member, columns, onDelete}) => {
  const classes = useStyles();

  const deleteMember = () => {
    onDelete(member)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box display="flex">
          <Box display="flex" flexGrow={1}>
            <Typography variant="h6">{member.role}</Typography>
          </Box>
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
    </Card>
  );
};


export default withTracker(() => {
  const columns = Meteor.settings.public.PERSON_TEMPLATE;
  return {
    columns
  };
})(MemberDisplayCard);