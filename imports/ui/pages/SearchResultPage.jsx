import React from 'react';
import { connect } from 'react-redux';
import DetailedList from '../components/DetailedList';
import { Selection } from 'office-ui-fabric-react';
import { selectItem } from "../../actions";
import { withRouter } from "react-router-dom";

const SearchResult = ({items, selectItem, history}) => {
	const onItemInvoked = e => {
		console.log("Item invoked:", e);
		history.push({
		  pathname: "/add",
		  state: {
			record: e
		  }
		});
	};

	return (
		<div className="page--inner__container">
			<DetailedList items={items} onItemInvoked={onItemInvoked}/>
		</div>
	);
};

function mapStateToProps(state) {
	return {
		items: state.RecordState.items,
	};
}

const ConnectedSearchPage = connect(mapStateToProps, {selectItem} )(SearchResult);

export default withRouter(({history}) => <ConnectedSearchPage history={history}/>);
