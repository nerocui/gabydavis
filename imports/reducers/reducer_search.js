import TYPES from '../actions/type';

export const SearchInitialState = {
  searchTerm: ""
};

export default (state = SearchInitialState, action) => {
  switch (action.type) {
    case TYPES.SET_SEARCH_TERM:
      return Object.assign({}, state, {searchTerm: action.payload});
    default:
      return state;
  }
}
