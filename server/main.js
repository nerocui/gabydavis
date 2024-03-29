import { Meteor } from 'meteor/meteor';
import '../imports/api/db';
import '../imports/api/user';
import '../imports/api/keys';
import App from './App';
import '../imports/api/records';

Meteor.startup(() => {
  const app = new App();
  app.useMigrator();
});
