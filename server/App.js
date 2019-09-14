import { Meteor } from 'meteor/meteor';
import DataMigration from '../imports/data/migration';

export default class App {
	constructor() {
		this.settings = Meteor.settings;
		this.migrator = new DataMigration();
	}

	useMigrator(version = 'latest') {
		Migrations.migrateTo(version)
	}
}
