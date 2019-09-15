import React from "react";
import Dropzone from "../components/dropzone.jsx";
import { DefaultButton } from "office-ui-fabric-react";
import xlsx from "xlsx";
import { Meteor } from "meteor/meteor";
import ApiContastants from "../../constants/methods.js";

import recordParser from "../../util/recordParser.js";

import SuccessNotification from "../components/SuccessNotification";
import { Accounts } from "meteor/accounts-base";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from '@material-ui/core/CardMedia';

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
  }

  handleChange(files) {
    files.forEach(file => {
      try {
        // Create A File Reader HTML5
        const reader = new FileReader();
        reader.onload = function(e) {
          const rawData = e.target.result;
          const parsedData = xlsx.read(rawData, { type: "binary" });
          // If we have data from the imported excel sheet
          if (parsedData.SheetNames && parsedData.SheetNames.length > 0) {
            let records = [];
            // if we have sheets then go through each sheet..
            parsedData.SheetNames.forEach(sheetName => {
              const sheet = parsedData.Sheets[sheetName];
              const parsedSheet = xlsx.utils.sheet_to_json(sheet);
              for (const row in parsedSheet) {
                const record = new Object();
                record["people"] = [];
                for (const key in parsedSheet[row]) {
                  switch (key) {
                    case "File Number":
                      record["file_number"] = parsedSheet[row][key];
                      break;
                    case "Date of Application":
                      if (isNaN(new Date(parsedSheet[row][key]).getTime())) {
                        record["date_of_application"] = null;
                      } else {
                        record["date_of_application"] = new Date(
                          parsedSheet[row][key]
                        );
                      }
                      break;
                    case "Date Helped":
                      if (isNaN(new Date(parsedSheet[row][key]).getTime())) {
                        record["date_helped"] = null;
                      } else {
                        record["date_helped"] = new Date(parsedSheet[row][key]);
                      }
                      break;
                    case "Child":
                      const child = recordParser.parseChild(parsedSheet[row][key]);
                      record["people"].push(child);
                      record["child_id"] = child["_id"];
                      break;
                    case "Date of Birth":
                      if (isNaN(new Date(parsedSheet[row][key]).getTime())) {
                        record["date_of_birth"] = null;
                      } else {
                        record["date_of_birth"] = new Date(
                          parsedSheet[row][key]
                        );
                      }
                      break;
                    case "Parents":
                      record["people"] = [
                        ...record["people"],
                        ...recordParser.parseParents(parsedSheet[row][key])
                      ];
                      break;
                    case "Cancer Type":
                      record["cancer_type"] = parsedSheet[row][key];
                      break;
                    case "Diagnosis Date":
                      if (isNaN(new Date(parsedSheet[row][key]).getTime())) {
                        record["diagnosis_date"] = null;
                      } else {
                        record["diagnosis_date"] = new Date(
                          parsedSheet[row][key]
                        );
                      }
                      break;
                    case "Length of Treatment":
                      record["length_of_treatment"] = recordParser.parseLengthOfTreatment(parsedSheet[row][key]);
                      break;
                    case "Treatment Notes":
                      record["treatment_notes"] = parsedSheet[row][key];
                      break;
                    case "Heaven Date":
                      if (isNaN(new Date(parsedSheet[row][key]).getTime())) {
                        record["heaven_date"] = null;
                      } else {
                        record["heaven_date"] = new Date(parsedSheet[row][key]);
                      }
                      break;
                    case "Relapse":
                      record["relapse"] = parsedSheet[row][key];
                      break;
                    case "Date of Relapse":
                      if (isNaN(new Date(parsedSheet[row][key]).getTime())) {
                        record["date_of_relapse"] = null;
                      } else {
                        record["date_of_relapse"] = new Date(
                          parsedSheet[row][key]
                        );
                      }
                      break;
                    case "Street Address":
                      record["street_address"] = parsedSheet[row][key];
                      break;
                    case "City":
                      record["city"] = parsedSheet[row][key];
                      break;
                    case "Postal Code":
                      record["postal_code"] = parsedSheet[row][key];
                      break;
                    case "Phone Number":
                      record["phone_number"] = parsedSheet[row][key];
                      break;
                    case "Cell Phone Number":
                      record["cell_phone_number"] = parsedSheet[row][key];
                      break;
                    case "Email":
                      record["email"] = parsedSheet[row][key];
                      break;
                    case "Siblings":
                      record["people"] = [
                        ...record["people"],
                        ...recordParser.parseSiblings(parsedSheet[row][key])
                      ];
                      break;
                    case "Location of Visit":
                      record["location_of_visit"] = parsedSheet[row][key];
                      break;
                    case "Social Worker":
                      record["social_worker"] = parsedSheet[row][key];
                      break;
                    case "Other notes":
                      record["other_notes"] = parsedSheet[row][key];
                      break;
                  }
                }
                records.push(record);
              }
            });

            // Make meteor call
            //console.log(records);
            for (const key in records) {
              Meteor.call(ApiContastants.RECORD_API.INSERT, records[key]);
            }
          }
        };
        this.setState({
          completed: true
        });
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
              style={{height:100, width:100}}
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

export default SettingsPage;
