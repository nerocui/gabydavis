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

export function setSelected(items) {
	return {
		type: TYPES.SET_SELECTED,
		payload: items,
	};
}

export function selectItem(item) {
	return dispatch => {
		dispatch(setSelected(item));
	};
}

export function setRecords(items) {
	return {
		type: TYPES.SET_RECORDS,
		payload: items,
	};
}




export function setSearchTerm(term) {
	return {
		type: TYPES.SET_SEARCH_TERM,
		payload: term,
	};
}

export function onSearchTermChange(e) {
	return dispatch => {
		console.log("term is", e.target.value);
		dispatch(setSearchTerm(e.target.value));
	};
}

export function search(index, term) {
	console.log('trying to search');
	return dispatch => {
		console.log('searching');
		index.search({query: term})
			.then(({ hits }) => {
				console.log("hits: ", hits);
				dispatch(setRecords(hits));
			})
			.catch(e => {
				console.log('errors: ', e);
			});
	}
}
