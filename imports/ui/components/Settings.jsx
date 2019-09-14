import React from 'react';
import Dropzone from "./dropzone.jsx";
import { DefaultButton } from 'office-ui-fabric-react';

class Settings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			firstName: "",
			lastName: "",
		};
		this.handleChange = this.handleChange.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	handleChange(files, onChange, as) {
		const readAs = (as || "url").toLowerCase();

		// Build Promise List, each promise resolved by FileReader.onload.
		Promise.all(files.map(file => new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = result => {
				// Resolve both the FileReader result and its original file.
				resolve([result, file]);
			};

			// Read the file with format based on this.props.as.
			switch (readAs) {
				case "binary": {
					(reader).readAsBinaryString(file);
					break;
				}
				case "buffer": {
					reader.readAsArrayBuffer(file);
					break;
				}
				case "text": {
					reader.readAsText(file);
					break;
				}
				case "url": {
					reader.readAsDataURL(file);
					break;
				}
				default: {
					reader.readAsDataURL(file);
					break;
				}
			}
		})))
			.then(zippedResults => {
				// Run the callback after all files have been read.
				onChange(zippedResults);
			});
	}

	onChange(results) {
		results.forEach(result => {
			const [e, file] = result;
		});
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
