import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import { Route, Redirect } from "react-router-dom";
import { connect }  from 'react-redux';

class PrivateRoute extends Component {
	constructor(props) {
		super(props);
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.props.component;
		console.log("doing auth", this.props.logged_in);
		return (
			this.props.logged_in ? <COMPONENT /> : <Redirect to="/" />
		);
	}

	render() {
		const { component, ...rest } = this.props;
		return (
			<Route {...rest} render={this.renderRoute} />
		);
	}
}

function mapStateToProps(state) {
	return {
		logged_in: state.AuthState.logged_in,
	};
}

export default connect(mapStateToProps)(PrivateRoute);
