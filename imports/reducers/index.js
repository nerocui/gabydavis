import { combineReducers } from "redux";
import AuthState from './reducer_auth';
import KeyState from './reducer_keys';

const rootReducer = combineReducers({
	AuthState,
	KeyState,
});

export default rootReducer;

