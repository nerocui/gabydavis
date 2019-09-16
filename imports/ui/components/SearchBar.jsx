import React from "react";
import { SearchBox } from "office-ui-fabric-react";
import { connect } from "react-redux";
import { onSearchTermChange, search } from '../../actions';
import algoliaSearch from "algoliasearch";


const SearchBar = ({onSearchTermChange, search, keys, searchTerm}) => {

	function onSearch() {
		const key = keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
		const client = algoliaSearch(key.algoliaApplicationID, key.algoliaAdminKey);
		const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
		const index = client.initIndex(indexName);

		search(index, searchTerm);
	}

	const items = [
		{
			file_number: 'some file number',
			date_helped: '03/04/2018',
			people: [
				{
					_id: 'vbfhsudebfj',
					first_name: "hduoasdh",
					last_name: "dasdas",
					role: 'child',
					date_of_birth: '03/04/2018'
				}
			],
			child_id: 'vbfhsudebfj',
			street_address: '6551 No 3 Rd',
			city: 'Richmond',
			postal_code: 'V6Y 2B6',
			phone_number: 12345678,
			cell_phone_number: 2134567,
			email: 'fgdhftre',
			cancer_type: 'dwesgrdhtfrewthjy',
			diagnosis_date: '03/04/2018',
			length_of_treatment: 123,
			treatment_notes: 'daefsgrdhtfjgftdgr',
			relapse: false,
			date_of_relapse: null,
			date_of_application: '03/04/2018',
			date_of_visit: '03/04/2018',
			location_of_visit: 'dasdrthfjyg',
			social_worker_name: 'dafesgrdhtfjyg',
			heaven_date: null,
			other_notes: 'it is working!'
		},
	];
	// Use for testing
	// setRecords(items);
	return (
		<SearchBox placeholder="Search" value={searchTerm} onChange={term => onSearchTermChange(term)} onSearch={onSearch} />
	);
}


function mapStateToProps(state) {
	return {
		keys: state.KeyState.keys,
		searchTerm: state.SearchState.searchTerm,
	}
}

export default connect(mapStateToProps, {onSearchTermChange, search})(SearchBar);
