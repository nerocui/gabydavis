import { combineReducers } from "redux";
import AuthState from './reducer_auth';
import KeyState from './reducer_keys';
import RecordState from './reducer_records';

const rootReducer = combineReducers({
	AuthState,
	KeyState,
	RecordState,
});

export default rootReducer;

