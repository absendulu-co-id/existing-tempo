import { FuseLoading } from "@fuse";
import PropTypes from "prop-types";
import React from "react";

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */ function FuseSuspense(props) {
  return <React.Suspense fallback={<FuseLoading {...props.loadingProps} />}>{props.children}</React.Suspense>;
}

FuseSuspense.propTypes = {
  loadingProps: PropTypes.object,
};

FuseSuspense.defaultProps = {
  loadingProps: {
    delay: 0,
  },
};

export default FuseSuspense;
