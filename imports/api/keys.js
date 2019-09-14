import { Meteor } from 'meteor/meteor';
import { Keys } from './db';
import PUBLICATIONS from '../constants/publication';

if (Meteor.isServer) {
	Meteor.publish(PUBLICATIONS.APIKEYS, ids => {
		if (Meteor.userId()) {
			return Keys.find({_id: {$in: ids}});
		}
	});
}
