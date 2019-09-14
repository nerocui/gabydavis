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
			Records.insert({record});
		},
	});
};

export default useRecordsAPI;
