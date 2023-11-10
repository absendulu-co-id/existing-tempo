import { Column } from "@material-table/core";
import { BaseTextFieldProps } from "@material-ui/core";
import { WrapperProps } from "formsy-react/dist/withFormsy";
import React from "react";

export type Render<T extends object = any> = (data: T, type?: "row" | "group") => React.ReactNode | any;

export interface GeneralConfig<T extends object = any> {
  primaryKey: string;

  model: string;
  endPoint: string;
  isImportEnabled?: boolean;
  customEndpoint?: string;
  customFilterApi?: string;
  include?: string;
  defaultOrder: string;
  sortDirection?: "asc" | "desc";
  customDataSelect?: string;
  CustomAction?: React.ElementType;

  prependContentTable?: React.ElementType;
  prependContentAddForm?: React.ElementType;
  prependContentEditForm?: React.ElementType;
  appendContentTable?: React.ElementType;
  appendContentAddForm?: React.ElementType;
  appendContentEditForm?: React.ElementType;

  fields?: GeneralConfigField<T>[];
}

export interface GeneralConfigFieldOption {
  label: string;
  value: any;
}

export interface GeneralConfigField<T extends object = any>
  extends Omit<BaseTextFieldProps, "title" | "draggable">,
    Omit<Column<T>, "id">,
    Partial<Omit<WrapperProps<T>, "innerRef" | "required" | "value">> {
  /**
   * **CAREFUL**, this variable used by MaterialTable, TextField, Fuse (Excel)
   */
  type?: any; // string | "boolean" | "time" | "date" | "numeric" | "datetime" | "currency" | "text" | React.InputHTMLAttributes<unknown>["type"]

  /* OVERRIDE VARIABLE */
  name: string;
  label: string;
  field?: string;
  render?: Render<T>;
  renderXls?: (data: T) => string | undefined;
  value?: any;

  /* CUSTOM VARIABLE */
  xlsType?:
    | "render"
    | "unix"
    | "unixminute"
    | "unixtime"
    | "time"
    | "date"
    | "voidStatusCustom"
    | "customObject"
    | "arrayToString"
    | "location"
    | "boolean";
  fieldType?: string;
  arrayField?: string;
  dataSource?: string;
  endPoint?: string;
  valueColumn?: string;
  labelColumn?: string;
  filter?: string;
  originOptions?: boolean;
  showInForm?: boolean;
  allowInsert?: boolean;
  search?: boolean;
  option?: GeneralConfigFieldOption[] | null;
  allowSearch?: boolean;
  showOnTable?: boolean;
  allowExport?: boolean;
  allowImport?: boolean;
  isAlias?: boolean;
  auth?: string[];
}
