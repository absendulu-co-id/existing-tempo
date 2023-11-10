import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

const NavLinkAdapter = (props, ref) => <NavLink innerRef={ref} {...props} />;

export default React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithoutRef<NavLinkProps<any>> & React.RefAttributes<HTMLAnchorElement>
>(NavLinkAdapter);
