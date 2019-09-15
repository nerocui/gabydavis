import React from 'react';
import Dropzone from "../components/dropzone.jsx";
import { DefaultButton } from 'office-ui-fabric-react';
import xlsx from "xlsx";
import { Meteor } from "meteor/meteor";
import ApiContastants from "../../constants/methods.js";

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
					const parsedData = xlsx.read(rawData, {type: 'binary'});
					// If we have data from the imported excel sheet
					if (parsedData.SheetNames && parsedData.SheetNames.length > 0) {
						let records = [];
						// if we have sheets then go through each sheet..
						parsedData.SheetNames.forEach(sheetName => {
              const sheet = parsedData.Sheets[sheetName];
              const parsedSheet = xlsx.utils.sheet_to_json(sheet);
							for (const row in parsedSheet) {
								const record = new Object();
								record["People"] = [];
								for (const key in parsedSheet[row]) {
									if (key == "Child") {
										record["People"].push(recordParser.parseChild(parsedSheet[row][key]));
									} else if (key ==  "Parents") {
										// record["People"].push([...record["People"],[recordParser.parseParents(parsedSheet[row][key])]]);
										record["People"] = [...record["People"], ...recordParser.parseParents(parsedSheet[row][key])];
									} else if (key == "Siblings") {
										record["People"] = [...record["People"], ...recordParser.parseSiblings(parsedSheet[row][key])];
									} else if (key == "Social Worker") {
										record["People"].push(recordParser.parseSocialWorker(parsedSheet[row][key]));
									} else {
										record[key] = parsedSheet[row][key];
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
				reader.readAsBinaryString(file);
			} catch(e) {
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
					inActiveText="Click or drop file(s) here to start the import..."
					activeText="Drop here to start the import..."
					handleChange={this.handleChange}
				/>
				<DefaultButton text="Export" onClick={this.exportFile} allowDisabledFocus />
			</div>
		);
	}
};

export default SettingsPage;
