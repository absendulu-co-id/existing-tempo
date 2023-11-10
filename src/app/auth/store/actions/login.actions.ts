import jwtService from "app/services/jwtService";
import { showMessage } from "app/store/actions";
import { Dispatch } from "react";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export function submitLogin({ username, password }) {
  return async (dispatch: Dispatch<any>) => {
    try {
      await jwtService.signInWithEmailAndPassword(username, password);

      return dispatch({
        type: LOGIN_SUCCESS,
      });
    } catch (error: any) {
      dispatch(
        showMessage({
          message: error.message,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "error",
        }),
      );

      return dispatch({
        type: LOGIN_ERROR,
        payload: error,
      });
    }
  };
}

export function submitLoginEmployee({ employeeId, password }) {
  return async (dispatch) => {
    try {
      await jwtService.signInWithEmployeeIdAndPassword(employeeId, password);

      return dispatch({
        type: LOGIN_SUCCESS,
      });
    } catch (error: any) {
      dispatch(
        showMessage({
          message: error.message,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: "error",
        }),
      );

      return dispatch({
        type: LOGIN_ERROR,
        payload: error,
      });
    }
  };
}
