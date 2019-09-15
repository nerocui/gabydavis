import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

import MemberEditorCard from "./MemberEditorCard";

const useStyles = makeStyles(theme => ({
  card: {
    width: '15rem',
    height: '12rem',
    backgroundColor: '#d0d0d0'
  }

}));

const PeopleEditor = ({isNew, people}) => {
  const classes = useStyles();

  // show 2 parent cards, 1 child card for new record
  const newList = [
    {
      first_name: "",
      last_name: "",
      role: "parent",
      date_of_birth: new Date()
    },
    {
      first_name: "",
      last_name: "",
      role: "parent",
      date_of_birth: new Date()
    },
    {
      first_name: "",
      last_name: "",
      role: "child",
      date_of_birth: new Date()
    },
  ]
  const [members, setMembers] = React.useState(isNew ? newList : people);
  const hasChild = !!members.find(member => member.role === "child");

  const addMemberCard = role => () => {
    setMembers(oldValues => [...oldValues, {
      first_name: "",
      last_name: "",
      role: role,
      date_of_birth: new Date()
    }])
  }

  return (
    <Grid container spacing={1}>
      {members.map(member => {
        return (
          <Grid item>
            <MemberEditorCard role={member.role} />
          </Grid>
        )
      })}
      <Grid item>
        <Card className={classes.card}>
          <CardContent>
            <Button onClick={addMemberCard("parent")}>+ Add Parent</Button>
            <Button onClick={addMemberCard("child")} disabled={hasChild}>+ Add Child</Button>
            <Button onClick={addMemberCard("sibling")}>+ Add Sibling</Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};


export default PeopleEditor;
