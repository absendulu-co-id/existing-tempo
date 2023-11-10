import { MuiThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

function FusePageSimpleHeader(props) {
  const mainThemeDark = useSelector(({ fuse }) => fuse.settings.mainThemeDark);

  return (
    <div className={props.classes.header}>
      {props.header && <MuiThemeProvider theme={mainThemeDark}>{props.header}</MuiThemeProvider>}
    </div>
  );
}

export default FusePageSimpleHeader;
