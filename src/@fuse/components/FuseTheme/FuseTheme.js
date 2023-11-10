import { MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { useSelector } from "react-redux";

function FuseTheme(props) {
  const mainTheme = useSelector(({ fuse }) => fuse.settings.mainTheme);

  // console.warn('FuseTheme:: rendered',mainTheme);
  return <MuiThemeProvider theme={mainTheme}>{props.children}</MuiThemeProvider>;
}

export default React.memo(FuseTheme);
