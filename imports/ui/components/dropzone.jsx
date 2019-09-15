import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ handleChange, wrapperStyle, activeText, inActiveText }) => {
  const onDrop = useCallback(acceptedFiles => {
    console.log("onDrop being called!!!!");
    handleChange(acceptedFiles);
  }, []);

  const { getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="page--settings-dropZone">
      <input {...getInputProps()} />
      <p className="page--settings-text">
        {isDragActive ? activeText : inActiveText}
      </p>
    </div>
  );
};

export default Dropzone;
