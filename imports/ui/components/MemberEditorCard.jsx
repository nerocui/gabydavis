import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  card: {
    width: '15rem',
    height: '12rem',
  }

}));

const MemberEditorCard = ({role, columns}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{role}</Typography>
        
        {columns.map(column => {
          if (column.type === "string" && column.field !== "role") {
            return (
              <Grid container>
                <Grid item xs={6}>{column.display_name}</Grid>
                <Grid item xs={6}>
                  <TextField margin="dense"></TextField>
                </Grid>
              </Grid>
            );
          } else if (column.type === "date") {
            return (
              <Grid container>
                <Grid item xs={6}>{column.display_name}</Grid>
                <Grid item xs={6}>
                  
                </Grid>
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
})(MemberEditorCard);