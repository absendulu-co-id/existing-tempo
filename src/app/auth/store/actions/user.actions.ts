import { UserState } from "../reducers/user.reducer";
import history from "@history";
import jwtService from "app/services/jwtService";
import { store } from "app/store";
import { setDefaultSettings, setInitialSettings, showMessage } from "app/store/actions";
import merge from "lodash/merge";
import { Dispatch } from "redux";

export const SET_USER_DATA = "[USER] SET DATA";
export const REMOVE_USER_DATA = "[USER] REMOVE DATA";
export const USER_LOGGED_OUT = "[USER] LOGGED OUT";

export function setUser(user: UserState) {
  return {
    type: SET_USER_DATA,
    user,
  };
}

export function setUserData(user: UserState) {
  return (dispatch: Dispatch, getState) => {
    // const fuseDefaultSettings = getState().fuse.settings.defaults;
    /*
    Set User Settings
    */
    if (user.data.settings == null) {
      // dispatch(setDefaultSettings(...fuseDefaultSettings));
    } else {
      dispatch(setDefaultSettings(user.data.settings));
    }

    /*
        Set User Data
         */
    dispatch({
      type: SET_USER_DATA,
      user,
    });
  };
}

export function updateUserSettings(settings) {
  return (dispatch, getState) => {
    const oldUser = getState().auth.user;
    const user = merge({}, oldUser, { data: { settings } });

    updateUserData(user);

    return dispatch(setUserData(user));
  };
}

export function updateUserShortcuts(shortcuts) {
  return (dispatch, getState) => {
    const user = getState().auth.user;
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    updateUserData(newUser);

    return dispatch(setUserData(newUser));
  };
}

export function removeUserData() {
  return {
    type: REMOVE_USER_DATA,
  };
}

export function logoutUser() {
  return (dispatch, getState) => {
    const user = getState().auth.user;

    if (!user.role || user.role.length === 0) {
      // is guest
      return null;
    }

    history.push({
      pathname: "/",
    });

    jwtService.setSession(null);

    dispatch(setInitialSettings());

    dispatch({
      type: USER_LOGGED_OUT,
    });
  };
}

export function updateUserData(user) {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      store.dispatch(showMessage({ message: "User data saved with api" }));
    })
    .catch((error) => {
      store.dispatch(showMessage({ message: error.message }));
    });
}
