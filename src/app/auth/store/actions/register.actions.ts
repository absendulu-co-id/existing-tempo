import * as UserActions from "./user.actions";
import jwtService from "app/services/jwtService";

export const REGISTER_ERROR = "REGISTER_ERROR";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

export function submitRegister({ displayName, password, email }) {
  return async (dispatch) =>
    await jwtService
      .createUser({
        displayName,
        password,
        email,
      })
      .then((user) => {
        dispatch(UserActions.setUserData(user));
        return dispatch({
          type: REGISTER_SUCCESS,
        });
      })
      .catch((error) => {
        return dispatch({
          type: REGISTER_ERROR,
          payload: error,
        });
      });
}
