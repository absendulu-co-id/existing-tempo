import FuseNavBadge from "./../FuseNavBadge";
import * as Actions from "app/store/actions";
import { FuseUtils, NavLinkAdapter } from "@fuse";
import { Icon, ListItem, ListItemText } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 48,
    "&.active": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText + "!important",
      pointerEvents: "none",
      "& .list-item-text-primary": {
        color: "inherit",
      },
      "& .list-item-icon": {
        color: "inherit",
      },
    },
    "& .list-item-icon": {},
    "& .list-item-text": {
      padding: "0 0 0 16px",
    },
    color: theme.palette.text.primary,
    textDecoration: "none!important",
  },
}));

function FuseNavHorizontalItem(props) {
  const dispatch = useDispatch();
  const userRole = useSelector(({ auth }) => auth.user.role);

  const classes = useStyles(props);
  const { item } = props;

  if (!FuseUtils.hasPermission(item.auth, userRole)) {
    return null;
  }

  return (
    <ListItem
      button
      component={NavLinkAdapter}
      to={item.url}
      activeClassName="active"
      className={clsx("list-item", classes.root)}
      onClick={(ev) => dispatch(Actions.navbarCloseMobile())}
      exact={item.exact}
    >
      {item.icon && (
        <Icon className="list-item-icon text-16 flex-shrink-0" color="action">
          {item.icon}
        </Icon>
      )}
      <ListItemText
        className="list-item-text"
        primary={item.title}
        classes={{ primary: "text-14 list-item-text-primary" }}
      />
      {item.badge && <FuseNavBadge className="ml-8" badge={item.badge} />}
    </ListItem>
  );
}

FuseNavHorizontalItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string,
  }),
};

FuseNavHorizontalItem.defaultProps = {};

const NavHorizontalItem = withRouter(React.memo(FuseNavHorizontalItem));

export default NavHorizontalItem;
