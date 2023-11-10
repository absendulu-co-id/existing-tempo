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
import { ModelState } from "./reducer.model";
import * as types from "@mid/components/field/types";
import * as Actions from "app/store/actions";
import { clearField, setValueByObject } from "@mid/store/formMaker/action.formMaker";
import { nanoid } from "@reduxjs/toolkit";
import history from "app/services/history";
import { RootState } from "app/store";
import { closeDialog } from "app/store/actions/fuse/dialog.actions";
import axios, { AxiosResponse } from "axios";
import { GeneralConfig } from "interface/general-config";

interface ColumnFiltered {
  name: string;
  value: string;
  isNotLike?: boolean;
}

export const initModel = (data: GeneralConfig) => (dispatch) => {
  const newConfig: Partial<ModelState> = {
    model: data.model,
    endPoint: data.endPoint,
    customEndpoint: data.customEndpoint,
    customFilterApi: data.customFilterApi,
    primaryKey: data.primaryKey,
    customDataSelect: data.customDataSelect,
    isImportEnabled: data.isImportEnabled,
    id: null,
    allData: [],
    filter: {
      column: [],
      page: 1,
      sortColumn: data.defaultOrder,
      limit: 10,
      sortDirection: data.sortDirection ? data.sortDirection : "asc",
      include: data.include,
    },
  };

  dispatch({
    type: INIT_MODEL,
    payload: newConfig,
  });
};

export const setPage = (page: number) => (dispatch, getState) => {
  const filter = getState().model.filter;

  filter.page = page;

  dispatch({
    type: SET_FILTER_DATA,
    payload: {
      filter,
    },
  });
  dispatch(fetchData());
};

export const sortColumn = (column) => (dispatch, getState) => {
  const filter = getState().model.filter;

  if (column.field === filter.sortColumn) {
    if (filter.sortDirection === "asc") {
      filter.sortDirection = "desc";
    } else {
      filter.sortDirection = "asc";
    }
  } else {
    filter.sortColumn = column.field;
    filter.sortDirection = "asc";
  }
  dispatch({
    type: SET_FILTER_DATA,
    payload: {
      filter,
    },
  });
  dispatch(fetchData());
};

export const filterData = () => (dispatch, state) => {
  const filteredField = (state() as RootState).formMaker.searchField();
  const filter = (state() as RootState).model.filter;
  const column: ColumnFiltered[] = [];
  filteredField.forEach((item, index) => {
    if (item.value) {
      if (item.fieldType === types.TYPE_FIELD_TEXT || item.fieldType === types.TYPE_FIELD_SELECT) {
        if (item.value !== "") {
          if (item.dataSource === "API") {
            column.push({
              name: item.valueColumn,
              value: item.value,
            });
          } else {
            column.push({
              name: item.name,
              value: item.value,
            });
          }
        }
      } else if (item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE) {
        if (item.value !== "") {
          column.push({
            name: item.valueColumn,
            value: item.value.value,
            isNotLike: true,
          });
        }
      }
    }
  });
  filter.column = column;
  dispatch({
    type: SET_FILTER_DATA,
    payload: {
      filter,
    },
  });
  dispatch(fetchData());
};

export const clearFilter = () => (dispatch, getState) => {
  const filter = getState().model.filter;
  dispatch({
    type: SET_FILTER_DATA,
    payload: {
      filter: {
        column: [],
        page: 1,
        sortColumn: filter.sortColumn,
        limit: 10,
        sortDirection: filter.sortDirection ? filter.sortDirection : "asc",
        include: filter.include,
      },
    },
  });
  dispatch(fetchData());
};

export const fetchAllData = () => async (dispatch, state) => {
  try {
    const { endPoint, filter, customEndpoint, customFilterApi } = (state() as RootState).model;
    let filterWhere = "";
    let customFilter = "";
    if (filter.column.length > 0) {
      filter.column.forEach((item, index) => {
        if (filterWhere === "") {
          filterWhere = "filter[where][" + item.name + "][like]=" + item.value;
        } else {
          filterWhere = "&filter[where][" + item.name + "][like]=" + item.value;
        }
      });
    }

    let filterOrder = `filter[order]=${filter.sortColumn}%20${filter.sortDirection}`;
    if (filterWhere !== "") {
      filterOrder = "&" + filterOrder;
    }
    if (filter.include) {
      filterOrder += `&filter[include]=${filter.include}`;
    }

    if (customEndpoint && customEndpoint !== "") {
      customFilter = customEndpoint;
    } else {
      customFilter = "findAndCount";
    }

    if (customFilterApi && customFilterApi !== "") {
      if (filterWhere !== "") {
        filterWhere += "&";
      }
      filterWhere += customFilterApi + "&";
    }

    const res = await axios.get(`/${endPoint}/${customFilter}?${filterWhere}${filterOrder}`);
    dispatch({
      type: GET_DATA_MODEL_PAGE_SUCCESS,
      payload: { allData: res.data.rows },
    });
  } catch (e) {
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const deleteData = (selectedData) => async (dispatch, state) => {
  try {
    dispatch({
      type: MODEL_PAGE_PENDING,
    });
    const { endPoint, primaryKey } = (state() as RootState).model;

    await Promise.all(
      selectedData.map(async (item) => {
        await axios.delete(`/${endPoint}/${item[primaryKey]}`);
      }),
    );

    dispatch(
      Actions.showMessage({
        message: "Data berhasil dihapus!", // text or html
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
        variant: "success", // success
      }),
    );
    dispatch(fetchData());
  } catch (e: any) {
    dispatch(
      Actions.showMessage({
        message: e.response.data.message, // text or html
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
        variant: "error", // success
      }),
    );
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const fetchDataById = (id: string | number) => async (dispatch, state) => {
  try {
    const { endPoint } = (state() as RootState).model;

    const res = await axios.get(`/${endPoint}/${id}`);
    if (res.status === 200) {
      setTimeout(() => {
        dispatch(setValueByObject(res.data));
      }, 300);
    }
    dispatch({
      type: SET_DATA_ID,
      payload: {
        id,
      },
    });
  } catch (e) {
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const fetchData = () => async (dispatch, state) => {
  try {
    dispatch({
      type: MODEL_PAGE_PENDING,
    });
    const { endPoint, filter, customDataSelect, customEndpoint, customFilterApi } = (state() as RootState).model;
    const { userType, defaultEmployeeId } = (state() as RootState).auth.user.data;
    let filterWhere = "";
    let customFilter = "";

    if (filter.column.length > 0) {
      filter.column.forEach((item, index) => {
        if (item.isNotLike) {
          filterWhere += "&filter[where][" + item.name + "]=" + item.value;
        } else {
          filterWhere += "&filter[where][" + item.name + "][like]=" + item.value;
        }
      });
    }

    let filterOrder = `&filter[order]=${filter.sortColumn}%20${filter.sortDirection}`;
    const skip = (filter.page - 1) * filter.limit;
    const filterLimit = `&filter[limit]=${filter.limit}&filter[skip]=${skip}`;
    if (filter.include) {
      filterOrder += `&filter[include]=${filter.include}`;
    }
    if (customEndpoint && customEndpoint !== "") {
      customFilter = customEndpoint;
    } else {
      customFilter = "findAndCount";
    }
    if (customFilterApi && customFilterApi !== "") {
      filterWhere += "&" + customFilterApi;
    }
    if (userType === "employee" && defaultEmployeeId) {
      filterWhere += `&filter[where][employeeId]=${defaultEmployeeId}`;
    }
    const res = await axios.get(`/${endPoint}/${customFilter}?${filterLimit}${filterWhere}${filterOrder}`);

    if (customDataSelect !== undefined) {
      res.data.rows.forEach((item) => {
        customDataSelect.forEach((item2) => {
          item[item2.name] = item2.value;
        });
      });
    }

    // Fix material table needs id property
    const rows = res.data.rows.map((x) => {
      if (x.id == null) {
        if (state.primaryKey == null) {
          x.id = nanoid();
        } else {
          x.id = x[state.primaryKey];
        }
      }

      return x;
    });

    dispatch({
      type: GET_DATA_MODEL_PAGE_SUCCESS,
      payload: {
        data: {
          count: res.data.count,
          rows,
        },
      },
    });
  } catch (e) {
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const saveData = () => async (dispatch, state) => {
  try {
    dispatch({
      type: SAVE_DATA_PENDING,
    });
    const { endPoint, id, model } = (state() as RootState).model;
    const { fieldList } = (state() as RootState).formMaker;
    let data = {};
    if (model !== "organization") {
      if (model === "user") {
        data = {
          defaultOrganizationId: (state() as RootState).auth.user.data.defaultOrganizationAccess.organizationId,
          userGroupId: 3,
          userGroupName: "adminOrg",
        };
      } else {
        data = {
          organizationId: (state() as RootState).auth.user.data.defaultOrganizationAccess.organizationId,
          organizationName: (state() as RootState).auth.user.data.defaultOrganizationAccess.organizationName,
        };
      }
    }

    fieldList.forEach((item) => {
      if (item.value !== "" && item.value !== null) {
        if (item.fieldType === types.TYPE_FIELD_SELECT) {
          if (item.dataSource !== "CUSTOM") {
            data[item.valueColumn!] = item.value;
          }
          data[item.name] = item.option?.filter((rowOption) => rowOption.value === item.value)[0].value;
        } else if (item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE) {
          if (item.isAlias) {
            if (item.value !== null && item.value !== undefined) {
              data[item.name] = item.value.value;
            }
          } else {
            if (item.value !== "") {
              data[item.valueColumn!] = item.value.value;
              data[item.labelColumn!] = item.value.label;
            }
          }
        } else {
          data[item.name] = item.value;
        }
      } else if (id !== null) {
        data[item.name] = item.value;
      }
    });
    let res: AxiosResponse | null = null;
    if (id === null) {
      res = await axios.post(`/${endPoint}/`, data);
    } else {
      res = await axios.patch(`/${endPoint}/${id}`, data);
    }

    if (res?.status === 200) {
      dispatch({
        type: SAVE_DATA_SUCCESS,
      });
      history.goBack();
      dispatch(clearField());
      dispatch(
        Actions.showMessage({
          message: "Data berhasil disimpan!", // text or html
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
          variant: "success", // success
        }),
      );
    }
  } catch (e) {
    console.error(e);
    dispatch(
      Actions.showMessage({
        message: "Terjadi Kesalahan!", // text or html
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
        variant: "error",
      }),
    );
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const updateLocalData = (dataUpdate) => (dispatch, getState) => {
  const { data } = getState().model;
  data.rows.filter((rowData) => {
    return rowData.serialNo === dataUpdate.id;
  })[0].statusDevice = dataUpdate.value;
  dispatch({
    type: GET_DATA_MODEL_PAGE_SUCCESS,
    payload: data,
  });
};

export const updateApproval = (id: string | number, data, isForm) => async (dispatch, state) => {
  try {
    if (!isForm) {
      dispatch(closeDialog());
    }
    dispatch({
      type: SAVE_DATA_PENDING,
    });

    const { endPoint, model } = (state() as RootState).model;
    let customEndpoint = "/";
    if (model !== "ApprovalShift") {
      customEndpoint = "/Approval-Update/";
    }

    const res = await axios.patch(`/${endPoint}${customEndpoint}${id}`, data);

    if (res.status === 200) {
      if (isForm) {
        history.goBack();
        setTimeout(() => {
          history.go(0);
        }, 1000);
      } else {
        history.go(0);
      }
      dispatch(clearField());
      dispatch({
        type: SAVE_DATA_SUCCESS,
      });
      dispatch(
        Actions.showMessage({
          message: "Data berhasil disimpan!", // text or html
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
          variant: "success", // success
        }),
      );
    }
  } catch (e) {
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const fetchApprovalDetail = (id: string | number) => async (dispatch, state) => {
  try {
    const { endPoint } = (state() as RootState).model;

    const res = await axios.get(`/${endPoint}/Approval-Detail/${id}`);
    if (res.status === 200) {
      dispatch({
        type: SET_APPROVAL_DETAIL,
        payload: res.data,
      });
    }
  } catch (e) {
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: e,
    });
  }
};

export const createData = (endPoint: string, data: any, isApproval?: boolean) => async (dispatch, state) => {
  try {
    dispatch({
      type: SAVE_DATA_PENDING,
    });

    const res = await axios.post(`/${endPoint}`, data);
    if (res.status === 200) {
      dispatch({
        type: SAVE_DATA_SUCCESS,
      });
      dispatch(
        Actions.showMessage({
          message: "Data berhasil disimpan!", // text or html
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
          variant: "success", // success
        }),
      );
      history.goBack();
      if (isApproval) {
        setTimeout(() => {
          history.go(0);
        }, 1000);
      }
    }
  } catch (err: any) {
    dispatch(
      Actions.showMessage({
        message: (
          <div>
            <b style={{ fontSize: 20 }}>Data gagal disimpan</b>
            <br></br>
            <span>{err.response.data.message}</span>
          </div>
        ), // text or html
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
        variant: "error", // success
      }),
    );
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: err,
    });
  }
};

export const updateData = (endPoint: string, data, id: string | number) => async (dispatch, state) => {
  try {
    dispatch({
      type: SAVE_DATA_PENDING,
    });
    const res = await axios.patch(`/${endPoint}/${id}`, data);
    if (res.status === 200) {
      dispatch({
        type: SAVE_DATA_SUCCESS,
      });
      dispatch(
        Actions.showMessage({
          message: "Data berhasil disimpan!", // text or html
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
          variant: "success", // success
        }),
      );
      history.goBack();
    }
  } catch (err: any) {
    dispatch(
      Actions.showMessage({
        message: (
          <div>
            <b style={{ fontSize: 20 }}>Data gagal disimpan</b>
            <br></br>
            <span>{err.response.data.message}</span>
          </div>
        ), // text or html
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
        variant: "error", // success
      }),
    );
    dispatch({
      type: GET_DATA_MODEL_PAGE_FAILED,
      payload: err,
    });
  }
};
