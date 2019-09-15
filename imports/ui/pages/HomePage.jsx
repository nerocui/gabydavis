import React from "react";
import { withRouter } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import { setSelected } from "../../actions";
import KEYID from "../../constants/key_id";
import { ReactBingmaps } from "react-bingmaps";
import {
  Fabric,
  MarqueeSelection,
  DetailsList,
  Selection,
  SelectionMode,
  DetailsListLayoutMode,
  HoverCard,
  HoverCardType
} from "office-ui-fabric-react";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.selection = new Selection({
      onSelectionChanged: () => {
        this.props.setSelected(this.selection.getItems());
      }
    });
    this.state = {
      columns: this.getColumns()
    };
    this.onItemInvoked = this.onItemInvoked.bind(this);
    this.onRenderPlainCard = this.onRenderPlainCard.bind(this);
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

  onRenderPlainCard(item) {
    if (this.bingApi !== "" && this.props.isMapEnabled) {
      const boundary = {
        search: `${item.street_address}, ${item.city}, ${item.postal_code}`,
        option: {
          entityType: "PopulatedPlace"
        },
        polygonStyle: {
          fillColor: "rgba(255, 255, 255, 0)",
          strokeColor: "#a495b2",
          strokeThickness: 2
        }
      };
      return (
        <div className="bingmap">
          <ReactBingmaps
            bingmapKey={this.bingApi}
            center={[13.0827, 80.2707]}
            mapTypeId={"road"}
            navigationBarMode={"compact"}
            boundary={boundary}
            style={{ height: "100%" }}
          />
        </div>
      );
    }
    return "";
  }

  getColumns() {
    const { RECORD_TEMPLATE } = Meteor.settings.public;
    if (!RECORD_TEMPLATE) {
      return [];
    }
    return RECORD_TEMPLATE.map(column => {
      return {
        key: column.field,
        name: column.display_name,
        // minWidth: 210,
        // maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        // isSorted: true,
        // isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        // onColumnClick: this._onColumnClick,
        isPadded: true,
        onRender: item => {
          switch (column.type) {
            case "people":
              console.log("rendering people");
              return (
                <div>
                  {item.people.map(person => (
                    <div>{`${person.first_name} ${person.last_name}`}</div>
                  ))}
                </div>
              );
            default:
              if (column.field === "street_address") {
                const plainCardProps = {
                  onRenderPlainCard: this.onRenderPlainCard,
                  renderData: item
                };
                console.log("rendering street address");
                return (
                  <HoverCard
                    plainCardProps={plainCardProps}
                    instantOpenOnClick={true}
                    type={HoverCardType.plain}
                  >
                    {item[column.field]}
                  </HoverCard>
                );
              }
              return <div>{item[column.field]}</div>;
          }
        }
      };
    });
  }

  render() {
    if (this.props.keys && this.props.keys.length !== 0) {
      console.log("Keys in chat list page: ", this.props.keys);
      const bingApi = this.props.keys.filter(
        key => key._id === KEYID.BING_MAP
      )[0].value;
      this.bingApi = bingApi;
    }
    return (
      <Fabric>
        <MarqueeSelection selection={this.selection}>
          <DetailsList
            items={this.props.items}
            compact={false}
            columns={this.state.columns}
            selectionMode={SelectionMode.multiple}
            getKey={item => item._id}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            selection={this.selection}
            selectionPreservedOnEmptyClick={true}
            onItemInvoked={this.onItemInvoked}
            enterModalSelectionOnTouch={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
          />
        </MarqueeSelection>
      </Fabric>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.RecordState.items,
    keys: state.KeyState.keys
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSelected: items => dispatch(setSelected(items))
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
  mapDispatchToProps
)(HomePageWithTracker);

export default withRouter(({ history }) => <ConnectedHome history={history} />);
