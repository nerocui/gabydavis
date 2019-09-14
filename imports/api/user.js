import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
	console.log("[backend onCreateUser]", options, user);
	const { profile_pic, first_name, last_name } = options;
	user.profile_pic = profile_pic;
	user.first_name = first_name;
	user.last_name = last_name;
	return user;
});
