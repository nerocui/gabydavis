import TYPES from './type';

export function login(user) {
	return {
		type: TYPES.LOGIN,
		payload: user
	};
}

export function logout() {
	return {
		type: TYPES.LOGOUT
	};
}

export function setKeys(keys) {
	return {
		type: TYPES.SET_KEYS,
		payload: keys,
	};
}
