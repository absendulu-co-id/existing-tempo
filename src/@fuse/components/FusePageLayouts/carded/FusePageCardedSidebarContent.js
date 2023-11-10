import { FuseScrollbars } from "@fuse";
import { MuiThemeProvider } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";

function FusePageCardedSidebarContent(props) {
  const mainThemeDark = useSelector(({ fuse }) => fuse.settings.mainThemeDark);

  const classes = props.classes;

  return (
    <React.Fragment>
      {props.header && (
        <MuiThemeProvider theme={mainThemeDark}>
          <div className={clsx(classes.sidebarHeader, props.variant)}>{props.header}</div>
        </MuiThemeProvider>
      )}

      {props.content && (
        <FuseScrollbars className={classes.sidebarContent} enable={props.innerScroll}>
          {props.content}
        </FuseScrollbars>
      )}
    </React.Fragment>
  );
}

export default FusePageCardedSidebarContent;
