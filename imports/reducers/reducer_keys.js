import TYPES from '../actions/type';

const initialState = {
	keys: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_KEYS:
			return Object.assign({}, state, {keys: action.payload});
		default:
			return state;
	}
}
