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

initializeIcons();

const items = (onAddRow, onDeleteRow) => {
  return [
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
      isEditorOpen: false
    };
    this.onAddRow = this.onAddRow.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.navigateToSettings = this.navigateToSettings.bind(this);
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

  navigateToSettings() {
    this.props.history.push("/settings");
  }

  openEditor() {
    this.setState({ isEditorOpen: true });
  }

  onAddRow() {
		console.log("add row");
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
            <CommandBar items={items(this.onAddRow, this.onDeleteRow)} />
          </Stack.Item>
          <Stack.Item align="center" disableShrink grow={1}>
            <SearchBox placeholder="Search" />
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
          <Editor closeModal={this.closeEditor}/>
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