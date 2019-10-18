import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Dropzone from "../components/dropzone.jsx";
import { DefaultButton } from "office-ui-fabric-react";
import xlsx from "xlsx";
import { Meteor } from "meteor/meteor";
import ApiContastants from "../../constants/methods.js";

import recordParser, { parseSheet } from "../../util/recordParser.js";

import SuccessNotification from "../components/SuccessNotification";
import { Accounts } from "meteor/accounts-base";
import { importRecords } from "../../actions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropZoneText: "Click or drop file(s) here to import...",
      completed: false
    };

    // Holds all the key top columns for the sheet.
    this.handleChange = this.handleChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  loadData(e) {
    const rawData = e.target.result;
    const parsedData = xlsx.read(rawData, { type: "binary" });
    // If we have data from the imported excel sheet
    if (parsedData.SheetNames && parsedData.SheetNames.length > 0) {
      let records = [];
      // if we have sheets then go through each sheet..
      parsedData.SheetNames.forEach(sheetName => {
        const sheet = parsedData.Sheets[sheetName];
        records = parseSheet(xlsx.utils.sheet_to_json(sheet));
      });
    }
    this.setState({
      completed: true
    });
    this.props.importRecords(records);
    this.props.history.push("/preview");
  }

  handleChange(files) {
    files.forEach(file => {
      try {
        // Create A File Reader HTML5
        const reader = new FileReader();
        reader.onload = this.loadData;
        reader.readAsBinaryString(file);
      } catch (e) {
        console.log(e);
      }
    });
  }

  exportFile() {
    // grab data here then export to local file system.
  }

  handleLogout() {
    Accounts.logout();
  }

  render() {
    const settingContainerStyles = {
      width: "auto",
      "text-align": "center"
    };
    return (
      <div>
        <div>
          <Card>
            <CardMedia
              style={{ height: 100, width: 100 }}
              image="https://www.canadahelps.org/uploads/CACHE/images/image/4/0181/ab9ebb11b00147209c69967022356238-gaby-davis-logo/29064946a80fdf8836da7d077de99a76.jpeg"
              title="logo"
            />
            <CardContent width>
              <Typography variant="h5" component="h2">
                Jonathan Sharma
              </Typography>
              <Typography color="textSecondary">Director</Typography>
              <Typography variant="body2" component="p">
                Email: jsharma@gdfoundation.com
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div style={settingContainerStyles}>
          <Dropzone
            wrapperStyle="component--admin__import"
            inActiveText="Click or drop file(s) here to import..."
            activeText="Drop here to start the import..."
            handleChange={this.handleChange}
          />
          <DefaultButton
            text="Log Out"
            onClick={this.handleLogout}
            allowDisabledFocus
          />
          <SuccessNotification
            successMessage={"Files imported successfully!"}
            shouldRender={this.state.completed}
          />
        </div>
      </div>
    );
  }
}

const ConnectedSettingsPage = connect(
  null,
  { importRecords }
)(SettingsPage);

export default withRouter(({ history }) => (
  <ConnectedSettingsPage history={history} />
));
