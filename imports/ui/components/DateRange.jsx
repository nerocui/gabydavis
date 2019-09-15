import React from "react";
import CalendarField from "./CalendarField";
import { areStartAndEndDatesValid, getDateRange } from "../../util/date";
import Grid from '@material-ui/core/Grid';

/**
 * Props must include:
 *  - start date (Date)
 *  - end date (Date)
 *  - onStartDateSubmit (function) (if needed to set start date somewhere in data)
 *  - onEndDateSubmit (function)   (if needed to set end date somewhere in data)
 *  - onBothDatesSubmitted (function)
 */

class DateRange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateRange: null,
      startDateIsSet: false,
      endDateIsSet: false,
      firstDate: this.props.startDate,
      secondDate: this.props.endDate
    };
  }

  onFirstDateSubmit(date) {
    this.setState({
      firstDate: date,
      startDateIsSet: true
    });

    this.props.onStartDateSubmit(date);

    if (endDateIsSet) {
      if (areStartAndEndDatesValid(date, this.state.secondDate)) {
        this.setState({
          dateRange: getDateRange(this.state.firstDate, this.state.secondState)
        });
        this.props.onBothDatesSubmitted(dateRange);
      }
    } else {
      // Do we want this functionality? Automatically sets date to current date if no end date
      // in order to calculate date range
      this.setState({
        dateRange: getDateRange(this.date, new Date())
      });
      this.props.onBothDatesSubmitted(dateRange);
    }
  }

  onSecondDateSubmit(date) {
    this.setState({
      secondDate: date,
      endDateIsSet: true
    });

    this.props.onEndDateSubmit(date);

    if (startDateIsSet) {
      if (areStartAndEndDatesValid(this.state.firstDate, date)) {
        this.setState({
          dateRange: getDateRange(this.state.firstDate, this.state.secondState)
        });
        this.props.onBothDatesSubmitted(dateRange);
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Grid container justify="space-around">
          <CalendarField
            fieldLabel={"Treatment start date"}
            selectedDate={this.props.startDate}
            onDateSubmit={onFirstDateSubmit}
          />
          <CalendarField
            fieldLabel={"Treatment end date"}
            selectedDate={this.props.endDate}
            onDateSubmit={onSecondDateSubmit}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export default DateRange;
