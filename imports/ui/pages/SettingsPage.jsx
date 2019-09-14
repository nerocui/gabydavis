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
				const data = xlsx.read(file, { type:"buffer" });
				console.log(data);
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
