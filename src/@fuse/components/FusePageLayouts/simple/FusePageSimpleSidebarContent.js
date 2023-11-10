import { FuseScrollbars } from "@fuse";
import { MuiThemeProvider } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSelector } from "react-redux";

function FusePageSimpleSidebarContent(props) {
  const mainThemeDark = useSelector(({ fuse }) => fuse.settings.mainThemeDark);

  const classes = props.classes;

  return (
    <FuseScrollbars enable={props.innerScroll}>
      {props.header && (
        <MuiThemeProvider theme={mainThemeDark}>
          <div
            className={clsx(
              classes.sidebarHeader,
              props.variant,
              props.sidebarInner && classes.sidebarHeaderInnerSidebar,
            )}
          >
            {props.header}
          </div>
        </MuiThemeProvider>
      )}

      {props.content && <div className={classes.sidebarContent}>{props.content}</div>}
    </FuseScrollbars>
  );
}

export default FusePageSimpleSidebarContent;
