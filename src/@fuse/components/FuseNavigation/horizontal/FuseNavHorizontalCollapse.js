import FuseNavBadge from "./../FuseNavBadge";
import FuseNavHorizontalGroup from "./FuseNavHorizontalGroup";
import FuseNavHorizontalItem from "./FuseNavHorizontalItem";
import FuseNavHorizontalLink from "./FuseNavHorizontalLink";
import * as ReactDOM from "react-dom";
import { FuseUtils, NavLinkAdapter } from "@fuse";
import { useDebounce } from "@fuse/hooks";
import { Grow, Icon, IconButton, ListItem, ListItemText, Paper } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Manager, Popper, Reference } from "react-popper";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .list-item-text": {
      padding: "0 0 0 16px",
    },
  },
  button: {
    color: theme.palette.text.primary,
    minHeight: 48,
    "&.active, &.active:hover, &.active:focus": {
      backgroundColor: theme.palette.secondary.main + "!important",
      color: theme.palette.secondary.contrastText + "!important",
      "& .list-item-text-primary": {
        color: "inherit",
      },
      "& .list-item-icon": {
        color: "inherit",
      },
    },
    "&.open": {
      backgroundColor: "rgba(0,0,0,.08)",
    },
  },
  popper: {
    zIndex: 999,
  },
  popperClose: {
    pointerEvents: "none",
  },
}));

function FuseNavHorizontalCollapse(props) {
  const userRole = useSelector(({ auth }) => auth.user.role);

  const classes = useStyles(props);
  const [opened, setOpened] = useState(false);
  const { item, nestedLevel, dense } = props;

  const handleToggle = useDebounce((open) => {
    setOpened(open);
  }, 150);

  if (!FuseUtils.hasPermission(item.auth, userRole)) {
    return null;
  }

  function isUrlInChildren(parent, url) {
    if (!parent.children) {
      return false;
    }

    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].children) {
        if (isUrlInChildren(parent.children[i], url)) {
          return true;
        }
      }

      if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
        return true;
      }
    }

    return false;
  }

  return (
    <ul className={clsx(classes.root, "relative pl-0")}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref}>
              <ListItem
                button
                className={clsx(
                  "list-item",
                  classes.button,
                  opened && "open",
                  isUrlInChildren(item, props.location.pathname) && "active",
                )}
                onMouseEnter={() => handleToggle(true)}
                onMouseLeave={() => handleToggle(false)}
                aria-owns={opened ? "menu-list-grow" : null}
                aria-haspopup="true"
                component={item.url ? NavLinkAdapter : "li"}
                to={item.url}
                role="button"
              >
                {item.icon && (
                  <Icon color="action" className="list-item-icon text-16 flex-shrink-0">
                    {item.icon}
                  </Icon>
                )}
                <ListItemText className="list-item-text" primary={item.title} classes={{ primary: "text-14" }} />
                {item.badge && <FuseNavBadge className="ml-8 mr-4" badge={item.badge} />}
                <IconButton disableRipple className="w-16 h-16 ml-4 p-0">
                  <Icon className="text-16 arrow-icon">keyboard_arrow_right</Icon>
                </IconButton>
              </ListItem>
            </div>
          )}
        </Reference>
        {ReactDOM.createPortal(
          <Popper placement="right" eventsEnabled={opened} positionFixed>
            {({ ref, style, placement, arrowProps }) =>
              opened && (
                <div
                  ref={ref}
                  style={{
                    ...style,
                    zIndex: 999 + nestedLevel + 1,
                  }}
                  data-placement={placement}
                  className={clsx(classes.popper, {
                    [classes.popperClose]: !opened,
                  })}
                >
                  <Grow in={opened} id="menu-list-grow" style={{ transformOrigin: "0 0 0" }}>
                    <Paper onMouseEnter={() => handleToggle(true)} onMouseLeave={() => handleToggle(false)}>
                      {item.children && (
                        <ul className={clsx(classes.children, "popper-navigation-list", dense && "dense", "pl-0")}>
                          {item.children.map((item) => (
                            <React.Fragment key={item.id}>
                              {item.type === "group" && (
                                <FuseNavHorizontalGroup item={item} nestedLevel={nestedLevel + 1} dense={dense} />
                              )}

                              {item.type === "collapse" && (
                                <NavHorizontalCollapse item={item} nestedLevel={nestedLevel + 1} dense={dense} />
                              )}

                              {item.type === "item" && (
                                <FuseNavHorizontalItem item={item} nestedLevel={nestedLevel + 1} dense={dense} />
                              )}

                              {item.type === "link" && (
                                <FuseNavHorizontalLink item={item} nestedLevel={nestedLevel + 1} dense={dense} />
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      )}
                    </Paper>
                  </Grow>
                </div>
              )
            }
          </Popper>,
          document.querySelector("#root"),
        )}
      </Manager>
    </ul>
  );
}

FuseNavHorizontalCollapse.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.array,
  }),
};

FuseNavHorizontalCollapse.defaultProps = {};

const NavHorizontalCollapse = withRouter(React.memo(FuseNavHorizontalCollapse));

export default NavHorizontalCollapse;
