import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

export interface PropsForwardRef extends RouteComponentProps<any> {
  forwardRef: any;
}

const withRouterAndRef = <P = {},>(Wrapped: React.ElementType) => {
  const WithRouter = withRouter<PropsForwardRef, any>(({ forwardRef, ...otherProps }) => (
    <Wrapped ref={forwardRef} {...otherProps} />
  ));
  const WithRouterAndRef: React.ForwardRefRenderFunction<any, P> = (props, ref) => (
    <WithRouter {...props} forwardRef={ref} />
  );

  return React.forwardRef<any, P>(WithRouterAndRef);
};

export default withRouterAndRef;
