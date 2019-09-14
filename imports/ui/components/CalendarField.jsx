import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

class CalendarField extends React.Component {
  constructor(props) {
    super(props);
    this.selectedDate = this.props.selectedDate;

    this.state = {
      selectedDate: this.props.selectedDate
    };
  }

  handleDateChange(date) {
    this.setState({ selectedDate: date });
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          id="date-picker-inline"
          label="Date picker inline"
          value={this.selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default CalendarField;
