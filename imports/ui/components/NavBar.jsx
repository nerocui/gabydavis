import React from "react";
import {
  CommandBar,
  initializeIcons,
  Stack,
  SearchBox,
  Modal
} from "office-ui-fabric-react";
import { connect } from "react-redux";
import { Accounts } from "meteor/accounts-base";
import Editor from "../components/Editor";
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
    subMenuProps: {
      items: [
        {
          key: "userProfile",
          name: "Profile",
          iconProps: {
            iconName: "ContactInfo"
          },
          "data-automation-id": "newEmailButton",
          onClick: onProfileClick
        },

        {
          key: "logOut",
          name: "Log Out",
          iconProps: {
            iconName: "Leave"
          },
          onClick: handleLogout
        }
      ]
    }
  },
  {
    key: "accountSettings",
    name: "Set",
    iconProps: {
      iconName: "Settings"
    },
    subMenuProps: {
      items: [
        {
          key: "import/export",
          name: "Import or Export",
          iconProps: {
            iconName: "Import"
          },
          onClick: routerHistory
        }
      ]
    }
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
      isEditorOpen: false,
      selectedRecord: null
    };
    this.onAddRow = this.onAddRow.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.navigateToSettings = this.navigateToSettings.bind(this);
    this.navigateToEditor = this.navigateToEditor.bind(this);
    this.navigateToHome = this.navigateToHome.bind(this);
    this.navigateToProfile = this.navigateToProfile.bind(this);
  }

  closeSettings() {
    this.setState({ isSettingsOpen: false });
  }

  closeEditor() {
    this.setState({ isEditorOpen: false });
  }

  openSettings() {
    this.setState({ isSettingsOpen: true });
  }

  closeSettings() {
    this.setState({ isSettingsOpen: false });
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

  openEditor() {
    this.setState({ isEditorOpen: true });
  }

  onAddRow() {
    this.setState({ selectedRecord: null });
    this.openEditor();
  }

  onDeleteRow() {
    console.log("delete row");
  }

  handleLogout() {
    Accounts.logout();
  }

  render() {
    let username = "";
    if (this.props.user) {
      username = this.props.user.username;
    }

    const keys = this.props.keys
    if (keys && keys.length > 0) {
      const key = keys.filter( key => { return key._id == "ALGOLIA"})[0].value;
      const client = algoliaSearch(key.algoliaApplicationID, key.algoliaAdminKey);
      const indexName = process.env.NODE_ENV === 'production' ? 'prod_gabydavis' : 'gaby_davis_records';
      const index = client.initIndex(indexName);

      index.search("").then(({hits}) => {
        this.props.setRecords(hits)
      })
        .catch(error => {
          console.log(error);
        });
    }
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
        <Modal
          isOpen={this.state.isEditorOpen}
          onDismiss={this.closeEditor}
          isBlocking={false}
        >
          <Editor
            record={this.props.selectedRecord}
            closeModal={this.closeEditor}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.AuthState.user,
    keys: state.KeyState.keys
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
