import { FORM_ADD_FIELD, FORM_ADD_FIELD_FAILED, FORM_RESET_FIELD, FORM_VALUE_UPDATE } from "./config.type";
import * as types from "@mid/components/field/types";
import { RootState } from "app/store";
import axios from "axios";
import { GeneralConfigField, GeneralConfigFieldOption } from "interface/general-config";
import { Dispatch } from "redux";

export const resetField = () => (dispatch: Dispatch) => {
  dispatch({
    type: FORM_RESET_FIELD,
  });
};

export const clearField = () => (dispatch: Dispatch, getState: () => RootState) => {
  const fields = getState().formMaker.fieldList;
  fields.forEach((item) => {
    if (item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE) {
      item.defaultValue = null;
      item.value = null;
    } else {
      item.value = item.defaultValue;
    }
  });

  dispatch({
    type: FORM_VALUE_UPDATE,
    payload: {
      fieldList: fields,
    },
  });
};

export const getOptions = (field: GeneralConfigField) => async (dispatch: Dispatch, getState: () => RootState) => {
  /** tambahkan logic ambil data select disini */
  const curList = getState().formMaker.fieldList;
  const indexFind = curList.findIndex((x) => x.name == field.name);

  const res = await axios.get(`/${field.endPoint}/findAndCount?${field.filter ?? ""}`, {
    params: {
      "filter[order]": `${field.labelColumn} asc`,
    },
  });

  console.log('res gan disini =>', res);

  const options: GeneralConfigFieldOption[] = [];
  if (res.status === 200 && res.data != null) {
    res.data.rows.forEach((item) => {
      if (field.originOptions) {
        options.push(item);
      } else {
        options.push({
          value: item[field.valueColumn!],
          label: item[field.labelColumn!],
        });
      }
    });
  }

  curList[indexFind].option = options;

  dispatch({
    type: FORM_VALUE_UPDATE,
    payload: curList,
  });
};

export const addField = (field: GeneralConfigField) => (dispatch: Dispatch, getState: () => RootState) => {
  try {
    if (field.fieldType === undefined) {
      field.type = "text";
    } else if (field.fieldType === types.TYPE_FIELD_DATE) {
      field.type = "date";
    } else if (field.fieldType === types.TYPE_FIELD_DATETIME) {
      field.type = "datetime";
    } else if (field.fieldType === types.TYPE_FIELD_NUMBER) {
      field.type = "number";
    } else if (field.fieldType === types.TYPE_FIELD_SELECT) {
      if (field.option === undefined) {
        field.option = [];
      }
    }
    if (field.value === undefined) {
      field.value = "";
    }
    if (field.defaultValue === undefined) {
      field.defaultValue = "";
    }
    if (field.allowExport === undefined) {
      field.allowExport = field.showOnTable;
    }
    dispatch({
      type: FORM_ADD_FIELD,
      payload: field,
    });
  } catch (e) {
    dispatch({
      type: FORM_ADD_FIELD_FAILED,
      payload: e,
    });
  }
};

export const setValue =
  (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>, newInputValue?, target?) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const fieldList = getState().formMaker.fieldList;

      const index = fieldList.findIndex((x) => x.name == (target ?? event.target.name));

      fieldList[index].value = newInputValue ?? event.target.value;

      if (fieldList[index].fieldType === types.TYPE_FIELD_AUTOCOMPLETE) {
        fieldList[index].value ??= null;
      } else {
        fieldList[index].value ??= "";
      }

      dispatch({
        type: FORM_VALUE_UPDATE,
        payload: fieldList,
      });
    } catch (err) {
      console.error("ActionFormMaker setValue field not found", err);
    }
  };

export const setValueByObject = (data) => (dispatch: Dispatch, getState: () => RootState) => {
  const curList = getState().formMaker.fieldList;
  curList.forEach((item) => {
    if (item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE) {
      if (item.isAlias) {
        item.value = item.option?.filter((rowOption) => rowOption.value === data[item.name])[0];
      } else {
        item.value = item.option?.filter((rowOption) => rowOption.value === data[item.valueColumn!])[0];
      }
    } else {
      item.value = data[item.name];
    }
  });
  // console.info("mid-debug-value-2", curList);
  dispatch({
    type: FORM_VALUE_UPDATE,
    payload: curList,
  });
};
