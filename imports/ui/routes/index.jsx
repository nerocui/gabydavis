import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SearchResultPage from "../pages/SearchResultPage";
import EditorPage from "../pages/EditPage";
import HomePage from "../pages/HomePage";
import NavBar from "../components/NavBar";
import { createBrowserHistory } from "history";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";

const history = createBrowserHistory();

const Routes = () => (
  <Router history={history}>
      <div>
        <NavBar history={history}/>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/search" component={SearchResultPage} />
          <PrivateRoute exact path="/add" component={EditorPage} />
          <PrivateRoute exact path="/profile" component={ProfilePage} />
        </Switch>
      </div>
  </Router>
);

export default Routes;
