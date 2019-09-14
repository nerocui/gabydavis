import React from 'react';
import Dropzone from "../components/dropzone.jsx";
import { DefaultButton } from 'office-ui-fabric-react';
import xlsx from "xlsx";

class SettingsPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dropZoneText: "Click or drop file(s) here to start the import..."
		};
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
						parsedData.SheetNames.forEach(sheetName => {
							for (const cell in parsedData.Sheets[sheetName]) {
								// types are denoted by n = number and s = string
								// v is the value gotten from the excel sheet
								const value = parsedData.Sheets[sheetName][cell].v;
								const type = parsedData.Sheets[sheetName][cell].t;
								//console.log(parsedData.Sheets[sheetName][cell]);
							}
						})
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
