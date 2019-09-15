import React from "react";
import Dropzone from "../components/dropzone.jsx";
import { DefaultButton } from "office-ui-fabric-react";
import xlsx from "xlsx";

import recordParser from "../../util/recordParser.js";

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropZoneText: "Click or drop file(s) here to start the import..."
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
                for (const key in parsedSheet[row]) {
                  record[key] = row[key];
                }
                records.push(record);
              }
            });

            // Make meteor call
            console.log(records);
          }
        };
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
      <div className="page--settings-container">
        <div className="page--settings-dropZone">
          <Dropzone
            className="page--settings-dropZone-container"
            wrapperStyle="component--admin__import"
            inActiveText="Click or drop file(s) here to start the import..."
            activeText="Drop here to start the import..."
            handleChange={this.handleChange}
          />
        </div>
        <DefaultButton
          text="Export"
          onClick={this.exportFile}
          allowDisabledFocus
        />
      </div>
    );
  }
}

export default SettingsPage;
