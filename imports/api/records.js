import {Meteor} from 'meteor/meteor';
import {Records} from './db';
import API from '../constants/methods';
import { isAuthenticated } from '../util/authUtil';
import algoliasearch from 'algoliasearch';

const key = Meteor.settings.apis.filter(api => api.id === "ALGOLIA")[0].value;
const client = algoliasearch(key.algoliaApplicationID, key.algoliaAdminKey);
const index = client.initIndex('gaby_davis_records');

Meteor.methods({
	[API.RECORD_API.INSERT](record) {
		if (!isAuthenticated()) {
			throw new Meteor.Error("Not authenticated");
		}
		const _id = Records.insert({record});
		index.addObject({
			objectID: _id,
			...record
		});
	},
	[API.RECORD_API.ADD_PERSON](_id, person) {
		if (!isAuthenticated()) {
			throw new Meteor.Error("Not authenticated");
		}
		const {people} = Records.findOne({_id});
		Records.update({_id}, {$set: {people: [...people, person]}});
		index.saveObject({
			objectID: _id,
			...Records.findOne({_id}),
		}, () => {
			console.log("Fail to update record in algolia");
		});
	},
	[API.RECORD_API.REMOVE_PERSON](_id, person_id) {
		if (!isAuthenticated()) {
			throw new Meteor.Error("Not authenticated");
		}
		const record = Records.findOne({_id});
		if (!record) {
			return;
		}
		const {people} = record;
		Records.update({_id}, {$set: {people: people.filter(person => person._id !== person_id)}});
		index.saveObject({
			objectID: _id,
			...Records.findOne({_id}),
		}, () => {
			console.log("Fail to update record in algolia");
		});
	},
	[API.RECORD_API.MODIFY](_id, field, value) {
		if (!isAuthenticated()) {
			throw new Meteor.Error("Not authenticated");
		}
		let mod = new Object();
		mod[field] = value;
		Records.update({_id}, {$set: mod});
		index.saveObject({
			objectID: _id,
			...Records.findOne({_id}),
		}, () => {
			console.log("Fail to update record in algolia");
		});
	},
});

