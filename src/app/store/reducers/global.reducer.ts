import * as types from "../types";
import { AnyAction } from "redux";

export interface GlobalReducerStatePageRule {
  addRule: boolean;
  editRule: boolean;
  deleteRule: boolean;
}

export interface GlobalReducerState {
  status: boolean;
  pageRule: GlobalReducerStatePageRule;
  loading: boolean;
  spinner: boolean;
  loadingForm: boolean;
  allData?: any;
  error?: any;
  tableData?: any;
}

const initialState: GlobalReducerState = {
  status: false,
  pageRule: {
    addRule: false,
    editRule: false,
    deleteRule: false,
  },
  allData: undefined,
  loading: false,
  spinner: false,
  loadingForm: false,
};

export function globalReducer(state = initialState, action: AnyAction): GlobalReducerState {
  switch (action.type) {
    case `${types.GET_DATA_PENDING}`:
      return {
        ...state,
        spinner: true,
      };
    case `${types.GET_DATA_ERROR}`:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case `${types.GET_ALL_DATA}`:
      return {
        ...state,
        loading: false,
        spinner: false,
        allData: {
          ...state.allData,
          [action.name]: action.payload,
        },
      };
    case `${types.GET_TABLE_DATA}`:
      return {
        ...state,
        spinner: false,
        tableData: action.tableData,
      };
    case `${types.CREATE_DATA}`:
      return {
        ...state,
        loadingForm: false,
      };
    case `${types.UPDATE_DATA}`:
      return {
        ...state,
        loadingForm: false,
      };
    case `${types.SET_PAGE_RULES}`:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
