import { REGISTER_ERROR, REGISTER_SUCCESS } from "../actions/register.actions";

const initialState = {
  success: false,
  error: {
    username: null,
    password: null,
  },
};

const register = function (state = initialState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS: {
      return {
        ...initialState,
        success: true,
      };
    }
    case REGISTER_ERROR: {
      return {
        success: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default register;
