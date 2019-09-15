import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'purple',
      },
    },
  },
})(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

/**
 * Props must include:
 *  - value (string)
 *  - fieldLabel (string)
 *  - onContentSubmit (function)
 */

export default function CustomizedInputs(props) {
  const classes = useStyles();

  const [content, setContent] = React.useState(props.value);
  
  function handleContentChange(event) {
    setContent(event.target.value);
    props.onContentSubmit(content);
  }

  return (
    <form className={classes.root}>
      <CssTextField
        className={classes.margin}
        variant="outlined"
        defaultValue={content}
        multiline={true}
        fullWidth
        label={props.fieldLabel}
        placeholder={props.fieldLabel}
        onChange={handleContentChange}
      />
    </form>
  );
}
