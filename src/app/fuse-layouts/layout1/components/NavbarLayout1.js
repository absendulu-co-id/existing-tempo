import { FuseScrollbars } from "@fuse";
import { AppBar, Hidden, Icon } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Logo from "app/fuse-layouts/shared-components/Logo";
import NavbarFoldedToggleButton from "app/fuse-layouts/shared-components/NavbarFoldedToggleButton";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import Navigation from "app/fuse-layouts/shared-components/Navigation";
import UserNavbarHeader from "app/fuse-layouts/shared-components/UserNavbarHeader";
import clsx from "clsx";

const useStyles = makeStyles({
  content: {
    overflowX: "hidden",
    overflowY: "auto",
    "-webkit-overflow-scrolling": "touch",
    background:
      "linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 40px, 100% 10px",
    backgroundAttachment: "local, scroll",
  },
});

function NavbarLayout1(props) {
  const classes = useStyles();

  return (
    <div className={clsx("flex flex-col overflow-hidden h-full", props.className)}>
      <AppBar
        color="primary"
        position="static"
        elevation={0}
        className="flex flex-row items-center flex-shrink pl-20 pr-12"
      >
        <Logo />

        <Hidden mdDown>
          <NavbarFoldedToggleButton className="w-40 h-40 p-0" />
        </Hidden>

        <Hidden lgUp>
          <NavbarMobileToggleButton className="w-40 h-40 p-0">
            <Icon>arrow_back</Icon>
          </NavbarMobileToggleButton>
        </Hidden>
      </AppBar>

      <FuseScrollbars className={clsx(classes.content)} option={{ suppressScrollX: true }}>
        <UserNavbarHeader />

        <Navigation layout="vertical" />
      </FuseScrollbars>
    </div>
  );
}

export default NavbarLayout1;
