import React from "react";
import CalendarField from "./CalendarField";
import { areStartAndEndDatesValid, getDateRange } from '../../util/date';

/**
 * Props must include:
 *  - start date (Date)
 *  - end date (Date)
 *  - onStartDateSubmit (function)
 *  - onEndDateSubmit (function)
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
      secondDate: this.props.endDate,
    };
  }

  onFirstDateSubmit(date) {
    this.setState({
      firstDate: date,
      startDateIsSet: true
    });

    props.onStartDateSubmit(date);

    if (endDateIsSet) {
      if (areStartAndEndDatesValid(date, this.state.secondDate)) {
        this.setState({
          dateRange: getDateRange(this.state.firstDate, this.state.secondState)
        });
      }
    } else {
      // Do we want this functionality? Automatically sets date to current date if no end date
      // in order to calculate date range
      this.setState({
        dateRange: getDateRange(this.date, new Date())
      });
    }
  }

  onSecondDateSubmit(date) {
    this.setState({
      secondDate: date,
      endDateIsSet: true
    });

    props.onEndDateSubmit(date);

    if (startDateIsSet) {
      if (areStartAndEndDatesValid(this.state.firstDate, date)) {
        // get date range
        this.setState({
          dateRange: getDateRange(this.state.firstDate, this.state.secondState)
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default DateRange;
