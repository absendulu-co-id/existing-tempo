import { FuseSearch } from "@fuse";
import { AppBar, Hidden, Toolbar } from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
}));

function ToolbarLayout1(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);

  const classes = useStyles(props);

  return (
    <MuiThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="primary">
        <Toolbar>
          {config.navbar.display && config.navbar.position === "left" && (
            <Hidden lgUp>
              <NavbarMobileToggleButton />
            </Hidden>
          )}

          {/* <div className="flex flex-1">
            <Hidden mdDown>
              <FuseShortcuts className="px-16" />
            </Hidden>
          </div> */}
          <div className="flex-grow" />

          <UserMenu />
          <div className={classes.separator} />

          <FuseSearch />
          <div className={classes.separator} />

          {/* <div className={classes.separator} />
          <QuickPanelToggleButton /> */}

          {config.navbar.display && config.navbar.position === "right" && (
            <Hidden lgUp>
              <NavbarMobileToggleButton />
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
}

export default ToolbarLayout1;
