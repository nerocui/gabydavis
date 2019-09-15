import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ handleChange, wrapperStyle, activeText, inActiveText}) => {

  const onDrop = useCallback(acceptedFiles => {
    console.log("onDrop being called!!!!");
    handleChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: wrapperStyle })}>
      <input {...getInputProps()} />
      <p className="element--dropzone__text">
        {isDragActive ? activeText : inActiveText}
      </p>
    </div>
  );
};

export default Dropzone;