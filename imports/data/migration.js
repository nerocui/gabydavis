import { Meteor } from 'meteor/meteor';
import { Accounts } from "meteor/accounts-base";
import { Keys } from '../api/db';

export default class DataMigration {
	constructor() {
		Migrations.add({
			version: 1,
			up: () => {
				const admins = Meteor.users.find({role: "admin"}).fetch();
				if (!admins || admins.length === 0) {
					let { email, username, password, first_name, last_name } = Meteor.settings;
					if (!(email && username && password && first_name, last_name)) {
						email = "admin";
						username = "admin";
						password = "admin";
						first_name = "admin";
						last_name = "admin";
					}
					Accounts.createUser({email, username, password, first_name, last_name});
				}
				const { apis } = Meteor.settings;
				if (apis && apis.length !== 0) {
					apis.map(api => {
						const existingApi = Keys.findOne({_id: api.id});
						if (!existingApi) {
							Keys.insert({_id: api.id, value: api.value});
						}
					})
				}
			},
			down: () => {
				Meteor.users.remove();
				Keys.remove();
			}
		});
	}
}
