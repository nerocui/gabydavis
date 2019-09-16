import React from "react";
import { withRouter } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import { selectItem, search } from "../../actions";
import KEYID from "../../constants/key_id";
import { ReactBingmaps } from "react-bingmaps";
import algoliaSearch from "algoliasearch";
import DetailedList from '../components/DetailedList';
import {
	Selection,
	HoverCard,
	HoverCardType,
	PersonaInitialsColor,
	Persona,
	PersonaSize,
	Text,
} from 'office-ui-fabric-react';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.selection = new Selection({
      onSelectionChanged: () => {
        this.props.selectItem(this.selection.getItems());
      }
    });
    this.onItemInvoked = this.onItemInvoked.bind(this);
  }

  onItemInvoked(e) {
    console.log("Item invoked:", e);
    this.props.history.push({
      pathname: "/add",
      state: {
        record: e
      }
    });
  }

  render() {
    if (this.props.keys && this.props.keys.length !== 0) {
      console.log("Keys in chat list page: ", this.props.keys);
	  
	  const algoliaKey = this.props.keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
      const client = algoliaSearch(algoliaKey.algoliaApplicationID, algoliaKey.algoliaAdminKey);
      const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
	  const index = client.initIndex(indexName);
	  this.props.search(index, this.props.searchTerm);
	}
	
    return (
		<div className="page--inner__container">
			<DetailedList
				selection={this.selection}
				items={this.props.items}
				onItemInvoked={this.onItemInvoked}
			/>
		</div>
    );
  }
}

function mapStateToProps(state) {
  return {
	keys: state.KeyState.keys,
	searchTerm: state.SearchState.searchTerm,
  };
}


const HomePageWithTracker = withTracker(() => {
  const features = Meteor.settings.public.FEATURE_FLAGS;
  const isMapEnabled = features.filter(feature => feature.id === "USE_MAP")[0]
    .enabled;
  return {
    isMapEnabled
  };
})(HomePage);

const ConnectedHome = connect(
  mapStateToProps,
  {selectItem, search}
)(HomePageWithTracker);

export default withRouter(({ history }) => <ConnectedHome history={history} />);
