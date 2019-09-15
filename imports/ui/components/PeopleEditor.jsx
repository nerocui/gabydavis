import React from "react";
import uniqid from "uniqid";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

import MemberEditorCard from "./MemberEditorCard";
import MemberDisplayCard from "./MemberDisplayCard";

const useStyles = makeStyles(theme => ({
  card: {
    width: '17rem',
    height: '14rem',
    backgroundColor: '#d0d0d0',
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(3),
  }

}));

const PeopleEditor = ({people, onChange}) => {
  const classes = useStyles();

  const hasChild = !!people.find(person => person.role === "child");

  const addMemberCard = role => () => {
    const newMember = {
      _id: uniqid(),
      role: role,
      isNew: true,
    };
    
    onChange([...people, newMember]);
  };

  const updateMember = member => {
    const newArray = [];
    people.forEach(p => {
      if (p._id === member._id) {
        newArray.push(member);
      } else {
        newArray.push(p);
      }
    });

    onChange(newArray);
  };

  return (
    <Grid container spacing={1}>
      {people.map(person => {
        return (
          <Grid item key={person._id}>
            {person.isNew ? 
              <MemberEditorCard member={person} onDoneEdit={updateMember}/> :
              <MemberDisplayCard member={person} />
            }
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
