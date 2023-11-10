import * as Actions from "app/store/actions";
import { FuseLayouts } from "@fuse";
import withStyles from "@material-ui/core/styles/withStyles";
import AppContext from "app/AppContext";
import { generateSettings } from "app/store/reducers/fuse/settings.reducer";
import isEqual from "lodash/isEqual";
import merge from "lodash/merge";
import React, { Component } from "react";
import { connect } from "react-redux";
import { matchRoutes } from "react-router-config";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    '& code:not([class*="language-"])': {
      color: theme.palette.secondary.dark,
      backgroundColor: "#F5F5F5",
      padding: "2px 3px",
      borderRadius: 2,
      lineHeight: 1.7,
    },
    "& table.simple tbody tr td": {
      borderColor: theme.palette.divider,
    },
    "& table.simple thead tr th": {
      borderColor: theme.palette.divider,
    },
    "& a:not([role=button])": {
      color: theme.palette.secondary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    '& [class^="border-"]': {
      borderColor: theme.palette.divider,
    },
    '& [class*="border-"]': {
      borderColor: theme.palette.divider,
    },
  },
});

class FuseLayout extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;

    this.state = {
      awaitRender: false,
      routes,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = props.location;
    const matched = matchRoutes(state.routes, pathname)[0];
    let newSettings = props.settings;

    if (state.pathname !== pathname) {
      if (matched && matched.route.settings) {
        const routeSettings = matched.route.settings;

        newSettings = generateSettings(props.defaultSettings, routeSettings);

        if (!isEqual(props.settings, newSettings)) {
          props.setSettings(newSettings);
        }
      } else {
        if (!isEqual(props.settings, props.defaultSettings)) {
          newSettings = merge({}, props.defaultSettings);

          props.resetSettings();
        }
      }
    }

    return {
      awaitRender: !isEqual(props.settings, newSettings),
      pathname,
    };
  }

  render() {
    const { settings, classes } = this.props;
    // console.warn('FuseLayout:: rendered');

    const Layout = FuseLayouts[settings.layout.style];

    return !this.state.awaitRender ? <Layout classes={{ root: classes.root }} {...this.props} /> : null;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSettings: Actions.setSettings,
      resetSettings: Actions.resetSettings,
    },
    dispatch,
  );
}

function mapStateToProps({ fuse }) {
  return {
    defaultSettings: fuse.settings.defaults,
    settings: fuse.settings.current,
  };
}

FuseLayout.contextType = AppContext;

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(React.memo(FuseLayout))),
);
