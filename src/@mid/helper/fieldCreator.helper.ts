import * as field from "../components/field";
import { GeneralConfigField } from "interface/general-config";
import React from "react";

export type FieldCreatorEventHandler = (event: React.ChangeEvent<any>, newValue?: any, fieldName?: string) => void;

export function createField(
  index: number,
  item: GeneralConfigField,
  handleChange: FieldCreatorEventHandler,
  isForm: boolean,
) {
  switch (item.fieldType) {
    case field.TYPE_FIELD_TEXT:
      if (isForm) {
        return field.createTextFieldFormsy(index, item, handleChange);
      } else {
        return field.createTextField(index, item, handleChange);
      }
    case field.TYPE_FIELD_SELECT: {
      if (isForm) {
        return field.createSelectFormsy(index, item, handleChange);
      } else {
        return field.createSelectSearch(index, item, handleChange);
      }
    }
    case field.TYPE_FIELD_AUTOCOMPLETE: {
      if (isForm) {
        return field.createAutoField(index, item, handleChange);
      } else {
        return field.createAutoField(index, item, handleChange);
      }
    }
    case field.TYPE_FIELD_SELECT_MULTIPLE: {
      if (isForm) {
        return field.createAutoField(index, item, handleChange, true);
      } else {
        return field.createAutoField(index, item, handleChange);
      }
    }
    case field.TYPE_FIELD_DATETIME: {
      if (isForm) {
        return field.createDateTimeFormsy(index, item, handleChange);
      } else {
        return field.createDateTimePicker(index, item, handleChange);
      }
    }
    case field.TYPE_FIELD_DATE:
    case field.TYPE_FIELD_NUMBER: {
      if (isForm) {
        return field.createTextFieldFormsy(index, item, handleChange);
      } else {
        return field.createTextField(index, item, handleChange);
      }
    }
    default:
      break;
  }
}
