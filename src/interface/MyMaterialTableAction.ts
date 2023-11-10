import * as H from "history";
import { IconifyIconProperties } from "@iconify-icon/react";
import { Action } from "@material-table/core";
import { IconButtonProps, IconButtonTypeMap, IconProps } from "@material-ui/core";
import { LinkProps } from "react-router-dom";

export interface MyAction<RowData extends object> extends Action<RowData> {
  actionRouter?: false;
  customButton?: null | undefined;
  to?: null | undefined;
}

export interface RequiredMyAction<RowData extends object = any, S = H.LocationState>
  extends Omit<Action<RowData>, "onClick" | "iconProps">,
    Omit<IconButtonProps<IconButtonTypeMap["defaultComponent"], LinkProps<S>>, "to"> {
  actionRouter: true;
  customButton?: null | undefined;

  to: (location: H.Location<S>, data: RowData) => H.LocationDescriptor<S>;
  iconProps?: IconProps | IconifyIconProperties;
}

export interface CustomButtonMyAction<RowData extends object = any> extends Action<RowData> {
  actionRouter?: false;
  customButton: (data: RowData | RowData[]) => React.ReactElement;
  to?: null | undefined;
}

export type MyMaterialTableAction<RowData extends object> =
  | MyAction<RowData>
  | RequiredMyAction<RowData>
  | CustomButtonMyAction<RowData>;
