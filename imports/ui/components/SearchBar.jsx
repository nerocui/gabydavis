import React from "react";
import { SearchBox } from "office-ui-fabric-react";
import { connect } from "react-redux";
import { setRecords } from '../../actions';


const SearchBar = ({setRecords}) => {
	const items = [
		{
			people: [
				{
					_id: 'vbfhsudebfj',
					first_name: "hduoasdh",
					last_name: "dasdas",
					role: 'child'
				}
			],
			child_id: 'vbfhsudebfj',
			street_address: 'dfsgh',
			city: 'sfdghjmjtrtewrt',
			postal_code: 'asfgdfhretwrtr',
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
	setRecords(items);
	return (
		<SearchBox placeholder="Search" />
	);
}

function mapDispatchToProps(dispatch) {
	return {
		setRecords: items => dispatch(setRecords(items)),
	};
}

export default connect(null, mapDispatchToProps)(SearchBar);
