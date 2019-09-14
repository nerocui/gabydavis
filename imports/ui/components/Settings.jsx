import React from "react";
import Dropzone from "./dropzone.jsx";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: ""
    };
    console.log(props);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleChange(files, onChange, as) {
    const readAs = (as || "url").toLowerCase();

    // Build Promise List, each promise resolved by FileReader.onload.
    Promise.all(
      files.map(
        file =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = result => {
              // Resolve both the FileReader result and its original file.
              resolve([result, file]);
            };

            // Read the file with format based on this.props.as.
            switch (readAs) {
              case "binary": {
                reader.readAsBinaryString(file);
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
          })
      )
    ).then(zippedResults => {
      // Run the callback after all files have been read.
      onChange(zippedResults);
    });
  }

  onChange(results) {
    results.forEach(result => {
      const [e, file] = result;
    });
  }

  /**
   *
   * @param {array} fileToExport
   */
  exportFile(fileToExport) {
    console.log("Exporting...");
  }

  render() {
    const { closeModal } = this.props;
    console.log("setting modal close:::", closeModal);
    return (
      <React.Fragment>
        <div className="modal--setting__container">
          <div className="modal--setting__modalTopBottom">
            <PrimaryButton
              className="modal--setting__closeButton"
              text="x"
              onClick={() => closeModal()}
            />
          </div>
          <div className="modal--setting__dropZone">
            <Dropzone
              as="binary"
              wrapperStyle="component--admin__import"
              inActiveText="Click or drop file(s) here to start the import..."
              activeText="Drop here to start the import..."
              handleChange={this.handleChange}
              onChange={this.onChange}
            />
          </div>
          <div className="modal--setting__modalTopBottom">
            <DefaultButton
              className="modal--setting__importButton"
              text="Export"
              onClick={this.exportFile}
              allowDisabledFocus
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Settings;
