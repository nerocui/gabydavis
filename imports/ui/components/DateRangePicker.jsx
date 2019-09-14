import * as React from "react";
import { DateRangePicker } from "@bit/atto-byte.components.date-range";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider, styled } from "@material-ui/styles";
const theme = createMuiTheme();

const Wrapper = styled("div")({
  width: "350px",
  padding: "20px"
});

class App extends React.Component {
  state = {
    fromDate: null,
    toDate: null
  };
  /*  2. Add state handler */
  _handleDateRangeChange = update => this.setState(update);

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          {/* 3. Add the material date range picker in your project */}
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

export default App;
