import { combineReducers } from "redux";
import AuthState, {AuthInitialState} from './reducer_auth';
import KeyState, {KeyInitialState} from './reducer_keys';
import RecordState, {RecordInitialState} from './reducer_records';
import SearchState, {SearchInitialState} from './reducer_search';

const rootReducer = combineReducers({
	AuthState,
	KeyState,
	RecordState,
	SearchState
});

export const initialState = {
	AuthState: AuthInitialState,
	KeyState: KeyInitialState,
	RecordState: RecordInitialState,
	SearchState: SearchInitialState,
};

export default rootReducer;

