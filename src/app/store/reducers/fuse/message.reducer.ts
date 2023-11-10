import * as Actions from "../../actions/fuse/index";
import { SnackbarProps } from "@material-ui/core/Snackbar/Snackbar";
import { Color as Severity } from "@material-ui/lab";
import { AnyAction } from "redux";

export type MessageStateOptions = SnackbarProps & { variant?: Severity };

interface MessageState {
  state?: boolean;
  options: MessageStateOptions;
}

const initialState: MessageState = {
  state: undefined,
  options: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
    autoHideDuration: 6000,
    message: "Hi",
    variant: "error",
  },
};

const message = function (state = initialState, action: AnyAction): MessageState {
  switch (action.type) {
    case Actions.SHOW_MESSAGE: {
      return {
        state: true,
        options: {
          ...initialState.options,
          ...action.options,
        },
      };
    }
    case Actions.HIDE_MESSAGE: {
      return {
        ...state,
        state: undefined,
      };
    }
    default: {
      return state;
    }
  }
};

export default message;
