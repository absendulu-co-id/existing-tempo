import * as Actions from "app/store/actions";
import { Icon, IconButton } from "@material-ui/core";
import set from "lodash/set";
import { useDispatch, useSelector } from "react-redux";

function NavbarFoldedToggleButton(props) {
  const dispatch = useDispatch();
  const settings = useSelector(({ fuse }) => fuse.settings.current);

  return (
    <IconButton
      className={props.className}
      onClick={() => {
        dispatch(
          Actions.setDefaultSettings(set({}, "layout.config.navbar.folded", !settings.layout.config.navbar.folded)),
        );
      }}
      color="inherit"
    >
      {props.children}
    </IconButton>
  );
}

NavbarFoldedToggleButton.defaultProps = {
  children: <Icon>menu</Icon>,
};

export default NavbarFoldedToggleButton;
