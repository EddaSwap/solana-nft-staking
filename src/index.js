import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
import { SnackbarProvider } from "notistack";

import "assets/scss/material-kit-react.scss?v=1.10.0";
import { makeStyles } from "@material-ui/core/styles";

import store from "./state";

import StakingPage from "views/Components/StakingPage";
import RewardPage from "views/Components/RewardPage";
import StatsPage from "views/Components/StatsPage";


import Snackbar from "components/Snackbar/";
import { closeSnackbar } from "./state/notify/actions";
import Button from "components/CustomButtons/Button.js";

var hist = createBrowserHistory();

const useStyles = makeStyles({
  root: {
    border: "1.5px solid #fff",
    borderRadius: 16,
  },
  message: {
    fontWeight: "bold",
    fontSize: 20,
  },
  dismissButton: {
    fontWeight: "bold",
  },
});

const App = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const action = (key) => (
    <Button
      className={classes.dismissButton}
      onClick={() => {
        dispatch(closeSnackbar(key));
      }}
    >
      Dismiss
    </Button>
  );

  return (
    <SnackbarProvider
      maxSnack={5}
      action={action}
      autoHideDuration={10000}
      classes={{
        contentRoot: classes.root,
        message: classes.message,
      }}
    >
      <Router history={hist}>
        <Switch>
        <Route path="/leaderboard" component={StatsPage} />
          <Route path="/reward" component={RewardPage} />
          <Route path="/" component={StakingPage} />
        </Switch>
      </Router>
      <Snackbar />
    </SnackbarProvider>
  );
};

Sentry.init({
  dsn: "https://3734b26828d54fc19a5257247e340418@o1095605.ingest.sentry.io/6115358",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (process.env.REACT_APP_ENV === 'production') {
  console.log = () => {}
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
