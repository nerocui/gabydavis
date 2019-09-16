import TYPES from '../actions/type';

export const KeyInitialState = {
	keys: [],
};

export default (state = KeyInitialState, action) => {
	switch (action.type) {
		case TYPES.SET_KEYS:
			return Object.assign({}, state, {keys: action.payload});
		default:
			return state;
	}
}
