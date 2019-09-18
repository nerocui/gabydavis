import React from "react";
import { SearchBox } from "office-ui-fabric-react";
import { connect } from "react-redux";
import { onSearchTermChange, search } from '../../actions';
import algoliaSearch from "algoliasearch";
import { withRouter } from "react-router-dom";


const SearchBar = ({onSearchTermChange, search, keys, searchTerm, history}) => {

	const onSearch = () => {
		const key = keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
		const client = algoliaSearch(key.algoliaApplicationID, key.algoliaAdminKey);
		const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
		const index = client.initIndex(indexName);

		search(index, searchTerm);
		history.push('/search');
	};
	
	return (
		<SearchBox placeholder="Search" value={searchTerm} onChange={term => onSearchTermChange(term)} onSearch={onSearch} />
	);
}


function mapStateToProps(state) {
	return {
		keys: state.KeyState.keys,
		searchTerm: state.SearchState.searchTerm,
	};
}

const ConnectedSearchBar = connect(mapStateToProps, {onSearchTermChange, search})(SearchBar);

export default withRouter(({history}) => <ConnectedSearchBar history={history}/>);
