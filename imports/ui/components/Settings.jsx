import React from 'react';
import Dropzone from "./dropzone.jsx";
import { DefaultButton } from 'office-ui-fabric-react';

class Settings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dropZoneText: "Click or drop file(s) here to start the import..."
		};
		this.handleChange = this.handleChange.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	handleChange(event) {
		console.log("running dropHandler!!!!");
		// results.forEach(result => {
		// 	const [e, file] = result;
		// });
	}

	onChange(event) {

	}

	exportFile() {
		// grab data here then export to local file system.

	}

	render() {
		return (
			<div className="modal--setting__container">
				<Dropzone
					as="binary"
					wrapperStyle="component--admin__import"
					inActiveText="Click or drop file(s) here to start the import..."
					activeText="Drop here to start the import..."
					handleChange={this.handleChange}
					onChange={this.onChange}
				/>
				<DefaultButton text="Export" onClick={this.exportFile} allowDisabledFocus />
			</div>
		);
	}
};

export default Settings;
