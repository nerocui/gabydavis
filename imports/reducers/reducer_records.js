import TYPES from '../actions/type';

export const RecordInitialState = {
	selected: [],
	items: []
};

export default (state = RecordInitialState, action) => {
	switch (action.type) {
		case TYPES.SET_SELECTED:
			return Object.assign({}, state, {selected: action.payload});
		case TYPES.SET_RECORDS:
			return Object.assign({}, state, {items: action.payload});
		default:
			return state;
	}
}
