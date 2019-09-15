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

initializeIcons();

const items = (onHomeClick, onAddRow, onDeleteRow) => {
  return [
    {
      key: "home",
      text: "Home",
      iconProps: {iconName: "Home"},
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

const userCommandBarItems = (name, routerHistory, handleLogout) => [
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
          "data-automation-id": "newEmailButton"
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
          key: "import",
          name: "Import",
          iconProps: {
            iconName: "Import"
          },
          onClick: routerHistory
        },
        {
          key: "export",
          name: "Export",
          iconProps: {
            iconName: "Export"
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
                    this.handleLogout
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
    user: state.AuthState.user
  };
}

const ConnectedNavBar = connect(mapStateToProps)(NavBar);

export default withRouter(({ history }) => (
  <ConnectedNavBar history={history} />
));
