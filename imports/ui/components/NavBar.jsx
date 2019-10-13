import React from "react";
import { Meteor } from 'meteor/meteor';
import API from '../../constants/methods';
import {
  CommandBar,
  initializeIcons,
  Stack,
  SearchBox,
  Modal,
  Dialog, DialogType, DialogFooter,
  PrimaryButton, DefaultButton,
} from "office-ui-fabric-react";
import { connect } from "react-redux";
import { Accounts } from "meteor/accounts-base";
import { withRouter } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import algoliaSearch from "algoliasearch";
import { setRecords } from '../../actions';

initializeIcons();

const items = (onHomeClick, onAddRow, onDeleteRow) => {
  return [
    {
      key: "home",
      text: "Home",
      iconProps: { iconName: "Home" },
      onClick: onHomeClick
    },
    {
      key: "addRow",
      text: "Insert row",
      iconProps: { iconName: "Add" },
      onClick: onAddRow
    },
    {
      key: "deleteRow",
      text: "Delete row",
      iconProps: { iconName: "Delete" },
      onClick: onDeleteRow
    }
  ];
};

const userCommandBarItems = (name, routerHistory, handleLogout, onProfileClick) => [
  {
    key: "userTab",
    name,
    cacheKey: "userTabCacheKey", // changing this key will invalidate this items cache
    iconProps: {
      iconName: "Contact"
    },
    ariaLabel: "User Settings",
    onClick: onProfileClick
  }
];

const nonShrinkingStackItemStyles = {
  root: {
    width: "15rem"
  }
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSettingsOpen: false,
      selectedRecord: null,
      deleteDialogOpen: false,
    };
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.navigateToSettings = this.navigateToSettings.bind(this);
    this.navigateToEditor = this.navigateToEditor.bind(this);
    this.navigateToHome = this.navigateToHome.bind(this);
    this.navigateToProfile = this.navigateToProfile.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
  }

  closeSettings() {
    this.setState({ isSettingsOpen: false });
  }

  openSettings() {
    this.setState({ isSettingsOpen: true });
  }

  closeSettings() {
    this.setState({ isSettingsOpen: false });
  }

  openDeleteDialog() {
    this.setState({deleteDialogOpen: true});
  }

  closeDeleteDialog() {
    this.setState({deleteDialogOpen: false});
  }

  navigateToHome() {
    this.props.history.push("/");
  }

  navigateToEditor() {
    this.props.history.push("/add");
  }

  navigateToSettings() {
    this.props.history.push("/settings");
  }

  navigateToProfile() {
    this.props.history.push("/profile");
  }

  onDeleteRow() {
    this.openDeleteDialog();
  }

  handleLogout() {
    Accounts.logout();
  }

  onDeleteConfirm() {
    this.props.selectedItem.map(item => {
      console.log("Trying to delete item: ", item);
      Meteor.call(API.RECORD_API.REMOVE, item.objectID);
    });
    this.closeDeleteDialog();
  }

  render() {
    let username = "";
    if (this.props.user) {
      username = this.props.user.username;
    }

    // const keys = this.props.keys
    // if (keys && keys.length > 0) {
    //   const key = keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
    //   const client = algoliaSearch(key.algoliaApplicationID, key.algoliaAdminKey);
    //   const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
    //   const index = client.initIndex(indexName);

    //   index.search("").then(({hits}) => {
    //     this.props.setRecords(hits)
    //   })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
    return (
      <div className="component--nav__navbar-container">
        <Stack horizontal horizontalAlign="space-between">
          <Stack.Item grow={1}>
            <CommandBar
              items={items(this.navigateToHome, this.navigateToEditor, this.onDeleteRow)}
            />
          </Stack.Item>
          <Stack.Item align="center" disableShrink grow={1}>
            <SearchBar />
          </Stack.Item>
          <Stack.Item grow={1}>
            <Stack horizontal horizontalAlign="end">
              <Stack.Item disableShrink styles={nonShrinkingStackItemStyles}>
                <CommandBar
                  items={userCommandBarItems(
                    username,
                    this.navigateToSettings,
                    this.handleLogout,
                    this.navigateToProfile
                  )}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
        <Modal
          isOpen={this.state.isSettingsOpen}
          onDismiss={this.closeSettings}
          isBlocking={false}
        ></Modal>
        <Dialog
            hidden={!this.state.deleteDialogOpen}
            onDismiss={this.closeDeleteDialog}
            dialogContentProps={{
              type: DialogType.close,
              title: 'Delete Confirmation',
              subText: `Do You Really Want To Delete This Record? Once Deleted, It Cannot Be Retrieved.`
            }}
            modalProps={{
              isBlocking: true,
              styles: { main: { maxWidth: 450 } }
            }}
          >
            <DialogFooter>
              <PrimaryButton onClick={this.onDeleteConfirm} text="Delete" />
              <DefaultButton onClick={this.closeDeleteDialog} text="Cancel" />
            </DialogFooter>
          </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.AuthState.user,
    keys: state.KeyState.keys,
    selectedItem: state.RecordState.selected,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setRecords: items => dispatch(setRecords(items))
  };
}

const ConnectedNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);

export default withRouter(({ history }) => (
  <ConnectedNavBar history={history} />
));
