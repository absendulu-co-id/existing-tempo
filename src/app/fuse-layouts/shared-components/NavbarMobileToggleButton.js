import * as Actions from "app/store/actions";
import { Icon, IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";

function NavbarMobileToggleButton(props) {
  const dispatch = useDispatch();

  return (
    <IconButton
      edge="start"
      className={props.className}
      onClick={(ev) => dispatch(Actions.navbarToggleMobile())}
      color="inherit"
      aria-label="open drawer"
    >
      {props.children}
    </IconButton>
  );
}

NavbarMobileToggleButton.defaultProps = {
  children: <Icon>menu</Icon>,
};

export default NavbarMobileToggleButton;
