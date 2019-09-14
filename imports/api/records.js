import {Meteor} from 'meteor/meteor';
import {Records} from './db';
import API from '../constants/methods';
import { isAuthenticated } from '../util/authUtil';

const useRecordsAPI = (recordTemplate) => {
	Meteor.methods({
		[API.RECORD_API.INSERT](record) {
			if (!isAuthenticated()) {
				throw new Meteor.Error("Not authenticated");
			}
			const { people, ...rest } = record;
			people.map(person => Meteor.call(API.PEOPLE_API.INSERT, person));
			Records.insert({...rest});
		},
	});
};

export default useRecordsAPI;
