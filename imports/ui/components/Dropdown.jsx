import React, { Component } from "react";
import { Select, MenuItem } from "@material-ui/core";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
      options: props.options
    };
    this.renderDropDown = this.renderDropDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  renderDropDown() {
    const { options, selected } = this.state;
    return (
      <Select label="something" value="12" onChange={this.handleSelect}>
        <MenuItem disabled value="">
          {selected}
        </MenuItem>
        {options.map((element, i) => (
          <MenuItem key={i} value={element}>
            {element}
          </MenuItem>
        ))}
      </Select>
    );
  }

  handleSelect(event) {
    this.setState(() => ({
      selected: event.target.value
    }));
  }

  render() {
    const { loading, options } = this.props;
    const { selected } = this.state;
    return <React.Fragment>{!loading && this.renderDropDown()}</React.Fragment>;
  }
}

export default Dropdown;
