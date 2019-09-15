import TYPES from '../actions/type';

const initialState = {
	selected: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_SELECTED:
			return Object.assign({}, state, {selected: action.payload});
		default:
			return state;
	}
}
