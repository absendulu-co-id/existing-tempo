import {
  GET_DATA_MODEL_PAGE_FAILED,
  GET_DATA_MODEL_PAGE_SUCCESS,
  INIT_MODEL,
  MODEL_PAGE_PENDING,
  SAVE_DATA_PENDING,
  SAVE_DATA_SUCCESS,
  SET_APPROVAL_DETAIL,
  SET_DATA_ID,
  SET_FILTER_DATA,
} from "./config.type";

export interface ModelState<T = any> {
  model: string;
  endPoint: string;
  primaryKey: string;
  isSaveSuccess: boolean;
  id: string | number | null;
  filter: {
    page: number;
    limit: number;
    column: T[];
    sortColumn: string;
    sortDirection: "asc" | "desc";
    include?: string;
  };
  data: {
    count: number;
    rows: T[];
  };
  allData: T[];
  spinner: boolean;
  loading: boolean;
  approvalDetail: any[];

  isImportEnabled?: boolean;
  customDataSelect?: any;
  customEndpoint?: any;
  customFilterApi?: any;
}

const initialState: ModelState = {
  model: "",
  endPoint: "",
  primaryKey: "",
  isSaveSuccess: false,
  id: null,
  filter: {
    page: 1,
    limit: 10,
    column: [],
    sortColumn: "vendorName",
    sortDirection: "desc",
    include: "",
  },
  data: {
    count: 0,
    rows: [],
  },
  allData: [],
  spinner: false,
  loading: false,
  approvalDetail: [],
};

export function model(state = initialState, action): ModelState {
  switch (action.type) {
    case INIT_MODEL: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SET_DATA_ID: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SET_APPROVAL_DETAIL: {
      return {
        ...state,
        approvalDetail: action.payload,
      };
    }
    case SAVE_DATA_PENDING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SAVE_DATA_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case MODEL_PAGE_PENDING: {
      return {
        ...state,
        spinner: true,
      };
    }
    case GET_DATA_MODEL_PAGE_SUCCESS: {
      return {
        ...state,
        ...action.payload,
        spinner: false,
      };
    }
    case GET_DATA_MODEL_PAGE_FAILED: {
      return {
        ...state,
        ...action.payload,
        spinner: false,
        loading: false,
      };
    }
    case SET_FILTER_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
