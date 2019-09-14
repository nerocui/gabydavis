import {Meteor} from 'meteor/meteor';
import {Records} from './db';
import API from '../constants/methods';
import { isAuthenticated } from '../util/authUtil';
import algoliasearch from 'algoliasearch';

const key = Meteor.settings.apis.filter(api => api.id === "ALGOLIA")[0].value;
const client = algoliasearch(key.algoliaApplicationID, key.algoliaAdminKey);
const userIndex = client.initIndex('gaby_davis_records');

Meteor.methods({
	[API.RECORD_API.INSERT](record) {
		if (!isAuthenticated()) {
			throw new Meteor.Error("Not authenticated");
		}
		const _id = Records.insert({record});
		userIndex.addObject({
			objectID: _id,
			...record
		});
	},
});

