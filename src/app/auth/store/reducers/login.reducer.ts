import { LOGIN_ERROR, LOGIN_SUCCESS } from "../actions/login.actions";
import { AnyAction } from "redux";

interface LoginState {
  success: boolean;
  error: any;
  isFinish: boolean;
}

const initialState: LoginState = {
  success: false,
  error: null,
  isFinish: false,
};

const login = function (state = initialState, action: AnyAction): LoginState {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...initialState,
        success: true,
      };
    }
    case LOGIN_ERROR: {
      return {
        success: false,
        isFinish: true,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default login;
