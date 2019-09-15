import TYPES from '../actions/type';

const initialState = {
  searchTerm: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.SET_SEARCH_TERM:
      return Object.assign({}, state, {searchTerm: action.payload});
    default:
      return state;
  }
}