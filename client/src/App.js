import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={(routerProps) => <HomePage {...routerProps} />}
        />
        <Route
          path="/profile"
          component={(routerProps) => <ProfilePage {...routerProps} />}
        />
        <Route
          path="/login"
          component={(routerProps) => <AuthPage {...routerProps} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
