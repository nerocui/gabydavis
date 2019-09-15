import TYPES from '../actions/type';

const initialState = {
	selected: [],
	items: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case TYPES.SET_SELECTED:
			return Object.assign({}, state, {selected: action.payload});
		case TYPES.SET_RECORDS:
			return Object.assign({}, state, {items: action.payload});
		default:
			return state;
	}
}
