import React from 'react';
import { withTracker } from "meteor/react-meteor-data";
import { withRouter, Redirect } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CameraPage from './CameraPage';
import firebase from "firebase";
import uniqid from 'uniqid';

const Input = withStyles({
	root: {
		'& .MuiOutlinedInput-input': {
			width: '20rem',
		},
	},
})(TextField);


class SignupPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			emailErr: '',
			passwordErr: '',
			err: null,
			cameraOpen: false,
			profile_pic: 'https://cdn1.iconfinder.com/data/icons/iconmart-web-icons-2/64/camera-512.png',
		}
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onToggleMode = this.onToggleMode.bind(this);

		this.onTakePhoto = this.onTakePhoto.bind(this);
		this.onCameraError = this.onCameraError.bind(this);
		this.onCameraStart = this.onCameraStart.bind(this);
		this.onCameraStop = this.onCameraStop.bind(this);
	}

	onEmailChange(e) {
		this.setState({email: e.target.value});
	}

	onPasswordChange(e) {
		this.setState({password: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		const {email, password, profile_pic} = this.state;
		const file = profile_pic.split(',')[1];
		const path = `profile_pics/${uniqid()}.jpg`;
		const storageRef = firebase.storage().ref(path);
		storageRef.putString(file, 'base64', {contentType:'image/jpg'}).then(function(snapshot) {
			storageRef.getDownloadURL().then(function(url) {
				Accounts.createUser({email, password, profile_pic: url}, err => {
					console.log(err);
				});
			});
			console.log('Uploaded a blob or file!', snapshot);
		});
	}

	onToggleMode() {
		this.props.history.push('/');
	}

	resetState() {
		this.setState({email: '', password: '', emailErr: '', passwordErr: '', err: '', cameraOpen: false});
	}

	onTakePhoto(dataUri) {
		console.log('Photo taken', dataUri);
		this.setState({cameraOpen: false, profile_pic: dataUri});
	}

	onCameraError(error) {
		console.log('camera error: ', error);
	}

	onCameraStart(stream) {
		console.log('camera started: ', stream);
	}

	onCameraStop() {
		console.log('camera stopped');
		this.setState({cameraOpen: false});
	}

	render() {
		if (this.props.loggedIn) {
			return (<Redirect to='/chatlist'/>);
		}
		return (
			<div className="page--authpage-container page">
				{
					this.state.cameraOpen ||
					<React.Fragment>
						<form onSubmit={this.onSubmit} className="component--authpage-form">
							<h1 className="component--authpage_title">Signup</h1>
							<div onClick={() => this.setState({cameraOpen: true})} className="profile_pic_container">
								<img src={this.state.profile_pic} />
							</div>
							
							<div className="form-input">
								<Input label="Email" value={this.state.email} onChange={this.onEmailChange} variant="outlined" />
							</div>
							<div className="form-input">
								<Input label="Password" value={this.state.password} onChange={this.onPasswordChange} type="password" variant="outlined" />
							</div>
							<div>
								<Button variant="contained" color="primary" type="submit">Signup</Button>
							</div>
							<div>
								<Button onClick={this.onToggleMode}>Already have an account? Login</Button>
							</div>
						</form>
					</React.Fragment>
				}
				<CameraPage
					isOpen={this.state.cameraOpen}
					onTakePhoto={this.onTakePhoto}
					onCameraError={this.onCameraError}
					onCameraStart={this.onCameraStart}
					onCameraStop={this.onCameraStop}
				/>
			</div>
		);
	}
}

const SignupPageContainer =  withTracker(
	() => {
		return {
			loggedIn: Meteor.userId(),
			createUser: Accounts.createUser,
		};
	}
)(SignupPage);

export default withRouter(({ history }) => (
	<SignupPageContainer history={history} />
));

