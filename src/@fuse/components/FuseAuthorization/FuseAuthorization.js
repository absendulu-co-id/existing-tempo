import { FuseUtils } from "@fuse";
import { getAccess } from "@mid/helper/navigation.helper";
import AppContext from "app/AppContext";
import { setPageRule } from "app/store/actions/globalAction";
import React, { Component } from "react";
import { connect } from "react-redux";
import { matchRoutes } from "react-router-config";
import { withRouter } from "react-router-dom";

class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: true,
      routes,
    };
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location, userRole, navigation, setPageRule } = props;
    const { pathname } = location;

    const matched = matchRoutes(state.routes, pathname)[0];

    try {
      if (navigation.navigation.length > 0) {
        const access = getAccess(navigation.navigation[0].children, location.pathname);
        setPageRule(access.addRule, access.editRule, access.deleteRule);
      }
    } catch (err) {
      console.error(err);
    }
    return {
      accessGranted: matched ? FuseUtils.hasPermission(matched.route.auth, userRole) : true,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  redirectRoute() {
    const { location, userRole, history } = this.props;
    const { pathname, state } = location;
    const redirectUrl = state && state.redirectUrl ? state.redirectUrl : "/";

    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRole || userRole.length === 0) {
      history.push({
        pathname: "/login",
        state: { redirectUrl: pathname },
      });
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or redirectUrl
        */
      history.push({
        pathname: redirectUrl,
      });
    }
  }

  render() {
    return this.state.accessGranted ? <React.Fragment>{this.props.children}</React.Fragment> : null;
  }
}

function mapStateToProps(state) {
  return {
    userRole: state.auth.user.role,
    navigation: state.fuse,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPageRule: (addRule, editRule, deleteRule) => {
      dispatch(setPageRule(addRule, editRule, deleteRule));
    },
  };
};

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FuseAuthorization));
