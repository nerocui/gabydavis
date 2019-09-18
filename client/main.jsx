import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import Routes from '../imports/ui/routes';
import rootReducer, { initialState } from '../imports/reducers';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import PUBLICATIONS from '../imports/constants/publication';
import { Keys } from '../imports/api/db';
import LoadingPage from '../imports/ui/pages/LoadingPage';
import LoginPage from '../imports/ui/pages/LoginPage';


Meteor.startup(() => {
  let keyHandle;
  let keyLoading = true;
  let keys = [];
  const createStoreWithMiddleware = applyMiddleware(ReduxPromise, ReduxThunk)(createStore);
  let store = createStoreWithMiddleware(
    rootReducer,
    initialState,
  );

  let user = null;
  let logged_in = false;

  Tracker.autorun(() => {
    user = Meteor.user();
    logged_in = !!Meteor.user();
    keyHandle = Meteor.subscribe(PUBLICATIONS.APIKEYS, ['BING_MAP', 'ALGOLIA']);
    keyLoading = !keyHandle.ready();
    keys = Keys.find({}).fetch();
    const state = initialState;
    state.KeyState.keys = keys;
    state.AuthState = {
      user,
      logged_in,
    };
    store = createStoreWithMiddleware(
      rootReducer,
      state,
    );

    if (logged_in) {
      if (!keyLoading) {
        render(
          <Provider store={store}>
            <Routes />
          </Provider>
          ,
          document.getElementById('react-target')
        );
      } else {
        render(
          <LoadingPage />,
          document.getElementById('react-target')
        );
      }
    } else {
      render(
        <LoginPage />,
        document.getElementById('react-target')
      );
    }
  });
  
  
});
