import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

/**
 * Props must include:
 *  - fieldLabel (string)
 *  - selectedDate (Date)
 *  - onDateSubmit (function)
 */

/** Example usage:

<CalendarField 
  fieldLabel='heaven date'
  selectedDate={new Date()}
  onDateSubmit={this.onFieldSubmit} // function to be declared within the file
/>
 */

export default function MaterialUIPickers(props) {
  const [selectedDate, setSelectedDate] = React.useState(props.selectedDate);
  const [isOpen, setDisplayState] = React.useState(false);

  function handleDateChange(date) {
    setSelectedDate(date);
    props.onDateSubmit(date);
    setDisplayState(false);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        open={isOpen}
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        id="date-picker-inline"
        label={props.fieldLabel}
        value={selectedDate}
        onClick={() => setDisplayState(!isOpen)}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
