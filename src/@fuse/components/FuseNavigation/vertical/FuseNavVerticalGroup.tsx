import FuseNavVerticalCollapse from "./FuseNavVerticalCollapse";
import FuseNavVerticalItem from "./FuseNavVerticalItem";
import FuseNavVerticalLink from "./FuseNavVerticalLink";
import * as Actions from "app/store/actions";
import { FuseUtils, NavLinkAdapter } from "@fuse";
import { ListSubheader } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { RootState } from "app/store";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  item: {
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingRight: 12,
    "&.active > .list-subheader-text": {
      fontWeight: 700,
    },
  },
}));

function FuseNavVerticalGroup(props) {
  const userRole = useSelector(({ auth }: RootState) => auth.user.role);
  const dispatch = useDispatch();

  const classes = useStyles(props);
  const { item, nestedLevel } = props;
  const paddingValue = 20 + nestedLevel * 16;
  const listItemPadding = nestedLevel > 0 ? "pl-" + (paddingValue > 80 ? 80 : paddingValue) : "pl-12";

  if (!FuseUtils.hasPermission(item.auth, userRole)) {
    return null;
  }

  return (
    <React.Fragment>
      <ListSubheader
        disableSticky={true}
        className={clsx(
          classes.item,
          listItemPadding,
          "list-subheader flex items-center",
          !item.url && "cursor-default",
        )}
        onClick={(ev) => dispatch(Actions.navbarCloseMobile())}
        component={item.url ? NavLinkAdapter : "li"}
        to={item.url}
        role="button"
      >
        <span className="list-subheader-text uppercase text-12">{item.title}</span>
      </ListSubheader>

      {item.children && (
        <React.Fragment>
          {item.children.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "group" && <NavVerticalGroup item={item} nestedLevel={nestedLevel} />}

              {item.type === "collapse" && <FuseNavVerticalCollapse item={item} nestedLevel={nestedLevel} />}

              {item.type === "item" && <FuseNavVerticalItem item={item} nestedLevel={nestedLevel} />}

              {item.type === "link" && <FuseNavVerticalLink item={item} nestedLevel={nestedLevel} />}
            </React.Fragment>
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

FuseNavVerticalGroup.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.array,
  }),
};

FuseNavVerticalGroup.defaultProps = {};

const NavVerticalGroup = withRouter(React.memo(FuseNavVerticalGroup));

export default NavVerticalGroup;
