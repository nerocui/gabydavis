import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import Routes from '../imports/ui/routes';
import rootReducer, { initialState } from '../imports/reducers';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';


const createStoreWithMiddleware = applyMiddleware(ReduxPromise, ReduxThunk)(createStore);
const store = createStoreWithMiddleware(
  rootReducer,
  initialState,
);
Meteor.startup(() => {
  render(
    <Provider store={store}>
      <Routes />
    </Provider>
    ,
    document.getElementById('react-target')
  );
});
