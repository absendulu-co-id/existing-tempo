// By default, this project supports all modern browsers.
// Support for Internet Explorer 11 requires polyfills.
// For to support Internet Explorer 11, install react-app-polyfill,
// https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import "./react-table-defaults";
import * as serviceWorker from "./serviceWorker";
import routes from "./app/fuse-configs/routesConfig";
import history from "./app/services/history";
import "./extensions/index";
import "./i18n";
import "./styles/index.scss";
import App from "app/App";
import i18next from "i18next";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { IntlProvider } from "react-intl";
import { matchPath } from "react-router-dom";

void i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
});

momentDurationFormatSetup(moment as any);
moment.locale("id");

void import("@sentry/react").then((Sentry) => {
  Sentry.init({
    dsn: "https://78920078ca624c0397ad39d83df69ab6@o4504670839242752.ingest.sentry.io/4504670840946688",
    tunnel: "https://st.absendulu.com",
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history, routes, matchPath),
      }),
      new Sentry.Replay({
        blockAllMedia: false,
        maskAllText: false,
      }),
    ],
    environment: process.env.NODE_ENV,
    release: `ab-admin-onpremise@${process.env.REACT_APP_BUILD_TIME_STAMP ?? ""}`,
    enabled: process.env.NODE_ENV === "production",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.05,

    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 0.2,
  });
});

ReactDOM.render(
  <IntlProvider
    locale={"id-ID"}
    defaultFormats={{
      number: {
        "id-Id": {
          currency: "SDF",
        },
      },
    }}
  >
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </IntlProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
void serviceWorker.unregister();
