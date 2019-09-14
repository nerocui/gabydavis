import { Meteor } from "meteor/meteor";
export const isAuthenticated = () => {
	console.log("[Auth Check: ]", Meteor.userId());
	return !!Meteor.userId() || Meteor.isTest;
};
