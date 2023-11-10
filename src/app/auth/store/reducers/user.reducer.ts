import { REMOVE_USER_DATA, SET_USER_DATA, USER_LOGGED_OUT } from "../actions/user.actions";
import { Organization } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { AnyAction } from "redux";

export interface UserData {
  displayName: string;
  username: string;
  userId: string;
  photoURL: string;
  email: string;
  shortcuts: any[];
  userType: string;
  defaultOrganizationAccess: Organization;
  defaultEmployeeId: string;
  defaultDepartmentId: string;
  defaultPositionId: string;
  approvalCount: {
    all: number;
    leave: number;
    overtime: number;
    training: number;
    manual_log: number;
    approval_shift: number;
  };

  settings?: any;
}

export interface UserState {
  role: any[];
  data: UserData;
}

const initialState: UserState = {
  role: [],
  data: {} as any,
};

const user = function (state = initialState, action: AnyAction): UserState {
  switch (action.type) {
    case SET_USER_DATA: {
      return {
        ...action.user,
      };
    }
    case REMOVE_USER_DATA: {
      return {
        ...initialState,
      };
    }
    case USER_LOGGED_OUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default user;
