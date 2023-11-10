import * as Actions from "../../actions/fuse/index";

export interface NavigationState {
  id: string;
  title: string;
  type: string;
  icon?: string | JSX.Element;
  url?: string;
  children?: NavigationState[];
  access?: {
    id: string;
    title: string;
  }[];
  auth?: string[];
  badge?: { title: number; bg: string; fg: string };
}

const initialState: NavigationState[] = [];

const navigation = function (state = initialState, action): NavigationState[] {
  switch (action.type) {
    case Actions.GET_NAVIGATION: {
      return [...state];
    }
    case Actions.SET_NAVIGATION: {
      return [...action.navigation];
    }
    case Actions.RESET_NAVIGATION: {
      return [...initialState];
    }
    default: {
      return state;
    }
  }
};

export default navigation;
