import FuseNavBadge from "../FuseNavBadge";
import * as Actions from "app/store/actions";
import { FuseUtils, NavLinkAdapter } from "@fuse";
import { Icon, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { RootState } from "app/store";
import clsx from "clsx";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface Props extends RouteComponentProps {
  item: {
    id: string;
    title: string;
    url: string;
    icon?: any;
    exact?: boolean;
    badge?: number;
    auth?: any[];
  };
  nestedLevel;
}

const useStyles = makeStyles((theme) => ({
  item: {
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingRight: 12,
    "&.active": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText + "!important",
      pointerEvents: "none",
      transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
      "& .list-item-text-primary": {
        color: "inherit",
      },
      "& .list-item-icon": {
        color: "inherit",
      },
    },
    "& .list-item-icon": {},
    "& .list-item-text": {},
    color: theme.palette.text.primary,
    cursor: "pointer",
    textDecoration: "none!important",
  },
}));

function FuseNavVerticalItem(props: Props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }: RootState) => auth.user);

  const classes = useStyles(props);
  const { item, nestedLevel } = props;
  const paddingValue = 12 + nestedLevel * 16;
  const listItemPadding = nestedLevel > 0 ? "pl-" + (paddingValue > 80 ? 80 : paddingValue) : "pl-12";

  if (!FuseUtils.hasPermission(item.auth, user.role)) {
    return null;
  }

  return (
    <ListItem
      button
      component={NavLinkAdapter}
      to={item.url}
      activeClassName="active"
      className={clsx(classes.item, listItemPadding, "list-item")}
      onClick={(ev) => dispatch(Actions.navbarCloseMobile())}
      exact={item.exact}
    >
      {item.icon && (
        <Icon className="list-item-icon text-16 flex-shrink-0 mr-8" color="action">
          {item.icon}
        </Icon>
      )}
      <ListItemText
        className="list-item-text"
        primary={item.title}
        classes={{ primary: "text-14 list-item-text-primary" }}
      />
      {item.badge && <FuseNavBadge badge={item.badge} />}
    </ListItem>
  );
}

FuseNavVerticalItem.defaultProps = {};

const NavVerticalItem = withRouter(React.memo(FuseNavVerticalItem));

export default NavVerticalItem;
