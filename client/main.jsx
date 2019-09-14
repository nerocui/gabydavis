import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from "redux";
import Routes from '../imports/ui/routes';
import rootReducer from '../imports/reducers';

const store = createStore(rootReducer);

Meteor.startup(() => {
  render(
    <Provider store={store}>
      <Routes />
    </Provider>
    ,
    document.getElementById('react-target')
  );
});
