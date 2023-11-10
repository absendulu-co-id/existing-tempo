import { Icon as Iconify, IconifyIconProperties } from "@iconify-icon/react";
import { MTableAction } from "@material-table/core";
import { Icon, IconButton, IconProps, Tooltip } from "@material-ui/core";
import { SvgIconComponent } from "@material-ui/icons";
import { MyMaterialTableAction } from "interface";
import omit from "lodash/omit";
import React from "react";
import { Link } from "react-router-dom";

interface Props<RowData extends Object = any> {
  action?: (() => void) | MyMaterialTableAction<RowData>;
  data?: RowData | RowData[];
  disabled: boolean;
  size: string;
}

export const MyMTableAction: React.FC<Props> = (props: Props) => {
  if (typeof props.action == "object") {
    const action = props.action;
    let button: React.ReactElement | undefined;
    if (props.action.actionRouter == true) {
      const PropsIcon = props.action.icon as SvgIconComponent;

      const icon: React.ReactNode =
        typeof props.action.icon === "string" ? (
          props.action.icon.includes(":") ? (
            <Iconify {...(props.action.iconProps as IconifyIconProperties)} icon={props.action.icon} />
          ) : (
            <Icon {...(props.action.iconProps as IconProps)}>{props.action.icon}</Icon>
          )
        ) : typeof props.action.icon === "function" ? (
          props.action.icon({
            ...props.action.iconProps,
            disabled: props.action.disabled,
          } as any)
        ) : (
          <PropsIcon />
        );

      button = (
        <IconButton
          disabled={props.disabled}
          component={Link}
          size="small"
          color="inherit"
          {...omit(props.action, ["actionRouter", "icon"])}
          to={(location) => action.to!(location, props.data)}
        >
          {icon}
        </IconButton>
      );
    } else if (props.action.customButton != null) {
      button = props.action.customButton(props.data);
    }

    if (button != null) {
      return <Tooltip title={props.action.tooltip ?? ""}>{button ?? <span>Please set button</span>}</Tooltip>;
    } else {
      return <MTableAction action={props.action} data={props.data} size={props.size} disabled={props.disabled} />;
    }
  }

  return <MTableAction action={props.action} data={props.data} size={props.size} disabled={props.disabled} />;
};
