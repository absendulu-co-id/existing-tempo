import { QuickPanelActions, QuickPanelActionsType } from "../actions";
import { AnyAction } from "redux";

export interface QuickPanelState<T = any> {
  state: boolean;
  data: T;
}

const initialState: QuickPanelState = {
  state: false,
  data: null,
};

export const quickPanel = function (state = initialState, action: AnyAction): QuickPanelState {
  switch ((action as QuickPanelActions).type) {
    case QuickPanelActionsType.TOGGLE_QUICK_PANEL: {
      return {
        ...state,
        state: !state.state,
      };
    }
    default: {
      return state;
    }
  }
};
