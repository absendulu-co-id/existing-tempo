/* eslint-disable no-async-promise-executor */
import * as userActions from "app/auth/store/actions";
import { FuseSplashScreen } from "@fuse";
import jwtService from "app/services/jwtService";
import { hideMessage, setNavigation, showMessage } from "app/store/actions";
import { adminMenu, employeeMenu } from "menu";
import { superAdminMenu } from "menu/super-admin";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

interface Props {
  logout: typeof userActions.logoutUser;
  setUserData: typeof userActions.setUserData;
  setUser: typeof userActions.setUser;
  showMessage: typeof showMessage;
  hideMessage: typeof hideMessage;
  setNavigation: typeof setNavigation;
}

class Auth extends React.Component<Props> {
  state = {
    waitAuthCheck: true,
  };

  async componentDidMount() {
    await this.jwtCheck();
    this.setState({ waitAuthCheck: false });
  }

  jwtCheck = async () =>
    await new Promise(async (resolve) => {
      jwtService.on("onAutoLogin", () => {
        jwtService
          .signInWithToken()
          .then((user: any) => {
            this.props.setUserData({
              role: [user.userType],
              data: {
                displayName: user.accountName,
                username: user.username,
                userId: user.userId,
                photoURL: "assets/images/avatars/profile.jpg",
                email: user.email,
                shortcuts: [],
                userType: user.userType,
                defaultOrganizationAccess: user.defaultOrganizationAccess,
                defaultEmployeeId: user.defaultEmployeeId,
                defaultDepartmentId: user.defaultDepartmentId,
                defaultPositionId: user.defaultPositionId,
                approvalCount: user.approvalCount,
              },
            });

            switch (user.userType) {
              case "Admin":
                this.props.setNavigation(superAdminMenu);
                break;
              case "adminOrg":
                this.props.setNavigation(adminMenu);
                break;
              case "employee":
                this.props.setNavigation(employeeMenu);
                break;
              default:
                throw new Error("Illegal userType");
            }

            resolve(true);
          })
          .catch((error) => {
            this.props.showMessage({ message: error });

            resolve(false);
          });
      });

      jwtService.on("onAutoLogout", (message: any) => {
        if (message) {
          // this.props.showMessage({ message });
        }

        this.props.logout();

        resolve(true);
      });

      jwtService.on("onNoAccessToken", () => {
        resolve(true);
      });

      jwtService.init();

      return await Promise.resolve();
    });

  render() {
    return this.state.waitAuthCheck ? <FuseSplashScreen /> : <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      logout: userActions.logoutUser,
      setUserData: userActions.setUserData,
      setUser: userActions.setUser,
      showMessage,
      hideMessage,
      setNavigation,
    },
    dispatch,
  );
}

export default connect(null, mapDispatchToProps)(Auth);
