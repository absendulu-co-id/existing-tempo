import * as Actions from "./store/actions/index";
import { FuseScrollbars } from "@fuse";
import { Drawer, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { RootState } from "app/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
  },
}));

const QuickPanel: React.FC = (props) => {
  const dispatch = useDispatch();
  const state = useSelector(({ quickPanel }: RootState) => quickPanel.state);

  const classes = useStyles();

  return (
    <Drawer
      classes={{ paper: classes.root }}
      open={state}
      anchor="right"
      onClose={(ev) => dispatch(Actions.toggleQuickPanel())}
    >
      <FuseScrollbars>
        <Typography>Quick Panel Hello World</Typography>
      </FuseScrollbars>
    </Drawer>
  );
};

export default QuickPanel;
