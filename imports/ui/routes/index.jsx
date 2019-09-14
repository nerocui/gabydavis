import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoginPage from "../pages/LoginPage";
import ChatListPage from '../pages/chatListPage';
import MomentsPage from '../pages/momentsPage';
import ContactsListPage from '../pages/contactsPage';
import MePage from '../pages/mePage';
import BottomTab from '../components/bottomTab';
import NavBar from '../components/NavBar';
import { isAuthenticated } from "../../util/authUtil";
import { createBrowserHistory } from 'history';
import PrivateRoute from './PrivateRoute';
import { login, logout, setKeys } from '../../actions';
import PUBLICATION from '../../constants/publication';
import { Keys } from '../../api/db';
import KEYID from '../../constants/key_id';
import firebase from 'firebase';

const history = createBrowserHistory();

class Routes extends React.Component {
	render() {
		if (this.props.user) {
			console.log('in login');
			this.props.login(this.props.user);
		} else {
			console.log('in here logout');
			this.props.logout();
		}
		if (!this.props.loadingKey) {
			this.props.setKeys(this.props.keys);
		}
		if (this.props.isFirebaseEnabled && this.props.firebaseConfig) {
			try {
				firebase.initializeApp(this.props.firebaseConfig);
				console.log('firebase initialized');
			} catch(e) {
				console.log('Firebase error initialized: ', e);
			}
		} else {
			console.log('firebase not enabled', this.props);
		}
		return (
			<Router history={history}>
				<Switch>
					<Route exact path='/' component={LoginPage }/>
					<div>
						<NavBar />
						<Switch>
							<PrivateRoute exact path='/chatlist' component={ChatListPage} />
						</Switch>
					</div>
				</Switch>
			</Router>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		login: user => dispatch(login(user)),
		logout: () => dispatch(logout()),
		setKeys: keys => dispatch(setKeys(keys)),
	};
}

function mapStateToProps(state) {
	const { keys } = state.KeyState;
	let firebaseConfig;
	if (keys && keys.length !== 0) {
		firebaseConfig = keys.filter(key => key._id === KEYID.FIREBASE)[0].value;
	}
	return {
		firebaseConfig,
	};
}

const ConnectedRoutes = connect(mapStateToProps, mapDispatchToProps)(Routes);

export default withTracker(() => {
	const keysHandler = Meteor.subscribe(PUBLICATION.APIKEYS, ['FIREBASE', 'BING_MAP', 'PAYPAL']);
	const loadingKey = !keysHandler.ready();
	const keys = Keys.find({}).fetch() || [];
	console.log("API keys are: ", keys);
	const features = Meteor.settings.public.FEATURE_FLAGS;
	const isFirebaseEnabled = features.filter(feature => feature.id === 'USE_FIREBASE')[0].enabled;
	return {
		user: Meteor.user(),
		keys,
		loadingKey,
		isFirebaseEnabled,
	};
})(ConnectedRoutes);
