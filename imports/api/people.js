import {Meteor} from 'meteor/meteor';
import {People} from './db';
import API from '../constants/methods';
import { isAuthenticated } from '../util/authUtil';

Meteor.methods({
	[API.PEOPLE_API.INSERT](person) {
		if (!isAuthenticated()) {
			throw new Meteor.Error("Not authenticated");
		}
		People.insert({...person});
	}
});
