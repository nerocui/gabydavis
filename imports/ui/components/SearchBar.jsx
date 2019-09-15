import React from "react";
import { SearchBox } from "office-ui-fabric-react";
import { connect } from "react-redux";
import { setRecords } from '../../actions';
import algoliaSearch from "algoliasearch";


const SearchBar = ({setRecords, keys}) => {
	const [term, setTerm] = React.useState("");

	function onChange(event) {
		setTerm(event.target.value);
	}

	function onSearch() {
		const key = keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
		const client = algoliaSearch(key.algoliaApplicationID, key.algoliaAdminKey);
		const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
		const index = client.initIndex(indexName);

		index.search(term).then(({hits}) => {
			setRecords(hits)
		})
		.catch(error => {
			console.log(error);
		});
		setTerm("");
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
		<SearchBox placeholder="Search" onChange={onChange} onSearch={onSearch} />
	);
}

function mapDispatchToProps(dispatch) {
	return {
		setRecords: items => dispatch(setRecords(items))
	};
}

function mapStateToProps(state) {
	return {
		keys: state.KeyState.keys
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
