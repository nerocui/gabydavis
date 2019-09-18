import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { selectItem, search } from "../../actions";
import KEYID from "../../constants/key_id";
import { ReactBingmaps } from "react-bingmaps";
import algoliaSearch from "algoliasearch";
import DetailedList from '../components/DetailedList';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
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
    const algoliaKey = this.props.keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
    const client = algoliaSearch(algoliaKey.algoliaApplicationID, algoliaKey.algoliaAdminKey);
    const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
    const index = client.initIndex(indexName);
    this.props.search(index, "");
	
    return (
      <div className="page--inner__container">
        <DetailedList
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
  };
}

const ConnectedHome = connect(
  mapStateToProps,
  {selectItem, search}
)(HomePage);

export default withRouter(({ history }) => <ConnectedHome history={history} />);
