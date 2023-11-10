import withRouterAndRef from "../withRouterAndRef/withRouterAndRef";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { RootState } from "app/store";
import clsx from "clsx";
import MobileDetect from "mobile-detect";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import React, { createRef, useCallback, useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  history?: any;
  className?: string;
  id?: any;
  enable?: boolean;
  option?: {
    wheelPropagation: boolean;
  };
  ref?: any;

  scrollToTopOnChildChange?: boolean;
  scrollToTopOnRouteChange?: boolean;
  onScrollY?: Function;
  onScrollX?: Function;
  onScrollUp?: Function;
  onScrollDown?: Function;
  onScrollLeft?: Function;
  onScrollRight?: Function;
  onYReachStart?: Function;
  onYReachEnd?: Function;
  onXReachStart?: Function;
  onXReachEnd?: Function;
}

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const handlerNameByEvent = {
  "ps-scroll-y": "onScrollY",
  "ps-scroll-x": "onScrollX",
  "ps-scroll-up": "onScrollUp",
  "ps-scroll-down": "onScrollDown",
  "ps-scroll-left": "onScrollLeft",
  "ps-scroll-right": "onScrollRight",
  "ps-y-reach-start": "onYReachStart",
  "ps-y-reach-end": "onYReachEnd",
  "ps-x-reach-start": "onXReachStart",
  "ps-x-reach-end": "onXReachEnd",
};
Object.freeze(handlerNameByEvent);

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const FuseScrollbars = (props, ref: any) => {
  ref ??= createRef();
  const ps = useRef(null as any);
  const handlerByEvent = useRef(new Map());
  const classes = useStyles();
  const { customScrollbars } = props;

  const hookUpEvents = useCallback(() => {
    Object.keys(handlerNameByEvent).forEach((key) => {
      const callback = props[handlerNameByEvent[key]];
      if (callback) {
        const handler = () => callback(ref.current);
        handlerByEvent.current.set(key, handler);
        ref.current.addEventListener(key, handler, false);
      }
    });
    // eslint-disable-next-line
  }, [ref]);

  const unHookUpEvents = useCallback(() => {
    handlerByEvent.current.forEach((value, key) => {
      if (ref.current) {
        ref.current.removeEventListener(key, value, false);
      }
    });
    handlerByEvent.current.clear();
  }, [ref]);

  const destroyPs = useCallback(() => {
    // console.info("destroy::ps");

    unHookUpEvents();

    if (!ps.current) {
      return;
    }
    ps.current.destroy();
    ps.current = null;
  }, [unHookUpEvents]);

  const createPs = useCallback(() => {
    // console.info("create::ps");

    if (isMobile || !ref || ps.current) {
      return;
    }

    ps.current = new PerfectScrollbar(ref.current, props.option);

    hookUpEvents();
  }, [hookUpEvents, props.option, ref]);

  useEffect(() => {
    function updatePs() {
      if (!ps.current) {
        return;
      }
      ps.current.update();
    }

    updatePs();
  });

  useEffect(() => {
    customScrollbars ? createPs() : destroyPs();
  }, [createPs, customScrollbars, destroyPs]);

  const scrollToTop = useCallback(() => {
    if (ref?.current) {
      ref.current.scrollTop = 0;
    }
  }, [ref]);

  useEffect(() => {
    if (props.scrollToTopOnChildChange) {
      scrollToTop();
    }
  }, [scrollToTop, props.children, props.scrollToTopOnChildChange]);

  useEffect(
    () =>
      props.history.listen(() => {
        if (props.scrollToTopOnRouteChange) {
          scrollToTop();
        }
      }),
    [scrollToTop, props.history, props.scrollToTopOnRouteChange],
  );

  useEffect(() => {
    return () => {
      destroyPs();
    };
  }, [destroyPs]);

  // console.info('render::ps');
  return (
    <div
      id={props.id}
      className={clsx(classes.root, props.className)}
      style={
        props.customScrollbars && (props.enable ?? true) && !isMobile
          ? {
              position: "relative",
              overflow: "hidden",
            }
          : {}
      }
      ref={ref}
    >
      {props.children}
    </div>
  );
};

function mapStateToProps({ fuse }: RootState) {
  return {
    customScrollbars: fuse.settings.current.customScrollbars,
  };
}

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});

export default connector(
  withRouterAndRef<Props>(React.forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(FuseScrollbars)),
);
