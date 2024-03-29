import TYPES from '../actions/type';

export const AuthInitialState = {
	user: null,
	logged_in: false,
};

export default (state = AuthInitialState, action) => {
	switch (action.type) {
		case TYPES.LOGIN:
			return Object.assign({}, state, { user: action.payload, logged_in: true });
		case TYPES.LOGOUT:
			return Object.assign({}, state, {user: null, logged_in: false});
		default:
			return state;
	}
};
