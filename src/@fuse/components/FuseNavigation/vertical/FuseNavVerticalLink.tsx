import FuseNavBadge from "../FuseNavBadge";
import * as Actions from "app/store/actions";
import { FuseUtils } from "@fuse";
import { Icon, ListItem, ListItemText } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { RootState } from "app/store";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  item: {
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingRight: 12,
    "&.active": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText + "!important",
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
    textDecoration: "none!important",
  },
}));

const propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string,
    target: PropTypes.string,
    auth: PropTypes.any,
    badge: PropTypes.any,
  }).isRequired,
};

interface Props extends RouteComponentProps, PropTypes.InferProps<typeof propTypes> {
  item: {
    id: string;
    title?: string | null;
    icon?: string | null;
    url?: string | null;
    target?: string | null;
    auth?: any | null;
    badge?: any | null;
  };
  nestedLevel;
  children?: ReactNode;
}

const FuseNavVerticalLink: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const userRole = useSelector<RootState>(({ auth }) => auth.user.role);

  const classes = useStyles(props);
  const { item, nestedLevel } = props;
  const paddingValue = 12 + nestedLevel * 16;
  const listItemPadding = nestedLevel > 0 ? "pl-" + (paddingValue > 80 ? 80 : paddingValue) : "pl-12";

  if (!FuseUtils.hasPermission(item.auth, userRole)) {
    return null;
  }

  return (
    <ListItem
      button
      // @ts-expect-error
      component={"a"}
      href={item.url}
      target={item.target ? item.target : "_blank"}
      className={clsx(classes.item, listItemPadding, "list-item")}
      onClick={(ev) => dispatch(Actions.navbarCloseMobile())}
      role="button"
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
};

FuseNavVerticalLink.propTypes = propTypes;
FuseNavVerticalLink.defaultProps = {};

const NavVerticalLink = withRouter(React.memo<Props>(FuseNavVerticalLink));

export default NavVerticalLink;
