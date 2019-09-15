import React from "react";
import Dropzone from "../components/dropzone.jsx";
import { DefaultButton } from "office-ui-fabric-react";
import xlsx from "xlsx";
import { Meteor } from "meteor/meteor";
import ApiContastants from "../../constants/methods.js";

import recordParser from "../../util/recordParser.js";

import SuccessNotification from '../components/SuccessNotification';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropZoneText: "Click or drop file here",
      completed: false
    };

    // Holds all the key top columns for the sheet.
    this.handleChange = this.handleChange.bind(this);
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
                      record["people"].push(
                        recordParser.parseChild(parsedSheet[row][key])
                      );
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
                      record["length_of_treatment"] = parsedSheet[row][key];
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

  render() {
    return (
      <div className="modal--setting__container">
        <Dropzone
          wrapperStyle="component--admin__import"
          inActiveText="Click or drop file here"
          activeText="Drop here to start the import..."
          handleChange={this.handleChange}
        />
        <DefaultButton
          text="Import file"
          onClick={this.exportFile}
          allowDisabledFocus
        />
        <SuccessNotification 
          successMessage={'Files imported successfully!'}
          shouldRender={this.state.completed}
        />
      </div>
    );
  }
}

export default SettingsPage;
