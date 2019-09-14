import React from 'react';
import {Tracker} from 'meteor/tracker';
import { withRouter } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Button } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';

class MePage extends React.Component {
	constructor(props) {
		super(props);
		this.onLogout = this.onLogout.bind(this);
	}

	onLogout() {
		Accounts.logout();
		console.log("just called logout, userid is:", Meteor.userId());
	}

	render() {
		return (
			<div>
				<div>
					<Button onClick={this.onLogout}>Log Out</Button>
				</div>
			</div>
		);
	}
}

export default withRouter(({ history }) => (
	<MePage history={history} />
));
