import React from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Zoom } from '@material-ui/core';

const CameraPage = ({isOpen=false, onTakePhoto, onCameraError, onCameraStart, onCameraStop}) => {
	return (
		<div className={isOpen?"page--camera":""} >
			{
				!isOpen ||
				(
					<Camera
						onTakePhoto = { (dataUri) => onTakePhoto(dataUri) }
						onCameraError = { (error) => onCameraError(error) }
						idealFacingMode = {FACING_MODES.ENVIRONMENT}
						imageType = {IMAGE_TYPES.JPG}
						imageCompression = {0.97}
						isMaxResolution = {true}
						isImageMirror = {false}
						isSilentMode = {false}
						isDisplayStartCameraError = {true}
						isFullscreen = {true}
						sizeFactor = {1}
						onCameraStart = { (stream) => onCameraStart(stream) }
						onCameraStop = { onCameraStop }
					/>
				)
			}
		</div>
		
	);
};

export default CameraPage;
