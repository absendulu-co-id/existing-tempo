import AppContext from "./AppContext";
import { Auth } from "./auth";
import { ErrorFallback } from "./components/ErrorFallback";
import routes from "./fuse-configs/routesConfig";
import { LoginShell } from "./main/login/LoginShell";
import { store } from "./store";
import MomentUtils from "@date-io/moment";
import { FuseAuthorization, FuseLayout, FuseTheme } from "@fuse";
import history from "@history";
import { createGenerateClassName, jssPreset, StylesProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ErrorBoundary, withProfiler } from "@sentry/react";
import { checkService } from "app/helper/checkService";
import { create } from "jss";
import jssExtend from "jss-extend";
import "moment/locale/id";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import swal from "sweetalert";

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  insertionPoint: document.getElementById("jss-insertion-point") ?? undefined,
});

const generateClassName = createGenerateClassName();

const App: React.FC = () => {
  const [redirectServerConfig, setRedirectServerConfig] = useState(false);

  useEffect(() => {
    const href = (window as Window).location.href.split("/");
    const lastUrl = href[href.length - 1];

    if (lastUrl.toLowerCase() != "server-config") {
      void checkService().then(async (result) => {
        if (result == "not_configured") {
          await swal({
            title: "Server Belum Diatur!",
            icon: "error",
          });

          setRedirectServerConfig(true);
        }
      });
    }
  });

  return (
    <AppContext.Provider
      value={{
        routes,
      }}
    >
      <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
        <StylesProvider jss={jss} generateClassName={generateClassName}>
          <Provider store={store}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Auth>
                <Router history={history}>
                  <FuseAuthorization>
                    {redirectServerConfig ? <Redirect to="/server-config" /> : ""}
                    <FuseTheme>
                      <FuseLayout>
                        <Switch>
                          <Route
                            path={["/login", "/forgot-password", "/forgot-password/:uuid", "/server-config"]}
                            exact
                            component={LoginShell}
                          />
                          {routes.map((route, i) => (
                            <Route
                              path={route.path}
                              exact
                              key={i}
                              render={(props) => (
                                // pass the sub-routes down to keep nesting
                                <route.component {...props} routes={route.routes} />
                              )}
                            />
                          ))}
                        </Switch>
                      </FuseLayout>
                    </FuseTheme>
                  </FuseAuthorization>
                </Router>
              </Auth>
            </MuiPickersUtilsProvider>
          </Provider>
        </StylesProvider>
      </ErrorBoundary>
    </AppContext.Provider>
  );
};

export default withProfiler(App);
