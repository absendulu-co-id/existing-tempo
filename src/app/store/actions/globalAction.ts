import * as types from "../types";
import history from "app/services/history";
import axios from "axios";
import swal from "sweetalert";

export const setPageRule = (addRule, editRule, deleteRule) => (dispatch) => {
  dispatch({
    type: types.SET_PAGE_RULES,
    payload: {
      pageRule: {
        addRule,
        editRule,
        deleteRule,
      },
    },
  });
};

export const getAllData = (endPoint, orderBy, order, params) => async (dispatch, state) => {
  try {
    dispatch({
      type: types.GET_DATA_PENDING,
    });
    const res = await axios.get(
      `/${endPoint}?filter[order]=${orderBy}%20${order === true ? "asc" : "desc"}${params === undefined ? "" : params}`,
    );
    dispatch({
      type: types.GET_ALL_DATA,
      payload: res.data,
      name: endPoint,
    });
  } catch (e) {
    dispatch({
      type: types.GET_DATA_ERROR,
      payload: e,
    });
  }
};

export const getTableData = (endPoint, orderBy, order, params, limit, skip) => async (dispatch, state) => {
  try {
    dispatch({
      type: types.GET_DATA_PENDING,
    });
    const resTable = await axios.get(
      `/${endPoint}/findAndCount?&filter[limit]=${limit}&filter[skip]=${skip}&filter[order]=${orderBy}%20${
        order === true ? "asc" : "desc"
      }${params === undefined ? "" : params}`,
    );
    dispatch({
      type: types.GET_TABLE_DATA,
      tableData: resTable.data,
    });
  } catch (e) {
    dispatch({
      type: types.GET_DATA_ERROR,
      payload: e,
    });
  }
};

export const createData = (endPoint, data) => async (dispatch, state) => {
  try {
    dispatch({
      type: types.GET_DATA_PENDING,
    });
    const res = await axios.post(`/${endPoint}`, data);
    await dispatch({
      type: types.CREATE_DATA,
      payload: res.data,
    });
    await swal("Sukses!", "Data berhasil disimpan!", "success").then((value) => {
      history.goBack();
    });
  } catch (e) {
    dispatch({
      type: types.GET_DATA_ERROR,
      payload: e,
    });
  }
};

export const updateVar = (data) => (dispatch) => {
  dispatch({
    type: types.SET_PAGE_RULES,
    payload: data,
  });
};

export const updateData = (endPoint, data, id) => async (dispatch, state) => {
  try {
    dispatch({
      type: types.GET_DATA_PENDING,
    });
    const res = await axios.patch(`/${endPoint}/${id}`, data);
    await dispatch({
      type: types.UPDATE_DATA,
      payload: res.data,
    });
    await swal("Sukses!", "Data berhasil diubah!", "success").then((value) => {
      history.goBack();
    });
  } catch (e) {
    dispatch({
      type: types.GET_DATA_ERROR,
      payload: e,
    });
  }
};
