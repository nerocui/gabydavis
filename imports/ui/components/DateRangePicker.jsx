import * as React from "react";
import { DateRangePicker } from "@bit/atto-byte.components.date-range";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider, styled } from "@material-ui/styles";
const theme = createMuiTheme();

const Wrapper = styled("div")({
  width: "350px",
  padding: "10px"
});

/**
 * Props must include:
 *  - startDate (string)
 *  - endDate (Date)
 *  - onDateRangeSubmit (function)
 */

/** Example usage:
        <DateRangePicker
          startDate={'2019-09-04'}
          endDate={'2019-09-14'}
          onDateRangeSubmit={...}
        />
 */

class MyDateRangePicker extends React.Component {
  state = {
    fromDate: this.props.startDate,
    toDate: this.props.endDate
  };

  _handleDateRangeChange = update => {
    this.setState(update)
    // TODO: uncomment once onDateRangeSubmit implemented
    // this.props.onDateRangeSubmit(update);
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <DateRangePicker
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            onChange={this._handleDateRangeChange}
            closeDialogOnSelection={false}
            dateFormat={"YYYY-MM-DD"}
          />
        </Wrapper>
      </ThemeProvider>
    );
  }
}

export default MyDateRangePicker;
