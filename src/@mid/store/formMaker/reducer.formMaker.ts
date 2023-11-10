import { FORM_ADD_FIELD, FORM_ADD_FIELD_FAILED, FORM_RESET_FIELD, FORM_VALUE_UPDATE } from "./config.type";
import * as type from "@mid/components/field/types";
import { Column } from "@material-table/core";
import { GeneralConfigField, Render } from "interface/general-config";
import moment from "moment";
import { AnyAction } from "redux";

export interface HeaderColumnExport {
  title: string;
  field: string;
}

export interface HeaderColumn<RowData extends object = any> extends Column<RowData> {
  render?: Render;
  sorting: boolean;
  hidden?: boolean;
  export?: boolean;
  columnsButton?: boolean;
  type?: "string" | "boolean" | "time" | "date" | "numeric" | "datetime" | "currency" | undefined;
}

export interface FormMakerState {
  dataValue: any[];
  fieldList: GeneralConfigField[];
  searchField: Function;
  tableHeaderColumn: () => HeaderColumn[];
  tableHeaderColumnExport: () => HeaderColumnExport[];
}

const initialState: FormMakerState = {
  dataValue: [],
  fieldList: [],
  searchField: function () {
    return this.fieldList.filter((row) => row.allowSearch);
  },
  tableHeaderColumn: function () {
    return this.fieldList
      .filter((row) => row.showOnTable)
      .map((item) => {
        const {
          label,
          name,
          fieldType,
          dataSource,
          endPoint,
          valueColumn,
          labelColumn,
          filter,
          originOptions,
          showInForm,
          allowInsert,
          search,
          option,
          allowSearch,
          showOnTable,
          allowExport,
          allowImport,
          isAlias,
          auth,
          ...other
        } = item;

        const newField: HeaderColumn = {
          ...other,
          title: other.title ?? label,
          field: other.field ?? name,
          sorting: other.sorting ?? true,
          hidden: other.hidden ?? false,
        };

        if (fieldType === type.TYPE_FIELD_DATETIME) {
          newField.render ??= (row) => {
            if (row[item.name] != null) {
              return moment(row[item.name]).format("YYYY-MM-DD HH:mm");
            }
            return null;
          };
        } else if (fieldType === type.TYPE_FIELD_DATE) {
          newField.render ??= (row) => {
            if (row[item.name] != null) {
              return moment(row[item.name]).format("DD-MM-YYYY");
            }
            return null;
          };
        }

        return newField;
      });
  },
  tableHeaderColumnExport: function () {
    const headerColumn: HeaderColumnExport[] = [];
    this.fieldList
      .filter((row) => row.allowExport)
      .forEach((item) => {
        headerColumn.push({
          title: item.label,
          field: item.name,
        });
      });
    return headerColumn;
  },
};

export function formMaker(state = initialState, action: AnyAction): FormMakerState {
  switch (action.type) {
    case FORM_ADD_FIELD: {
      state.fieldList.push(action.payload);
      return {
        ...state,
      };
    }
    case FORM_VALUE_UPDATE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case FORM_RESET_FIELD: {
      return {
        ...state,
        fieldList: [],
      };
    }
    case FORM_ADD_FIELD_FAILED: {
      return initialState;
    }
    default:
      return state;
  }
}
