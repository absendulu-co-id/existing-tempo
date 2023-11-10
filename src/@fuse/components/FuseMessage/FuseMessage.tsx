import * as Actions from "app/store/actions";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { RootState } from "app/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function FuseMessage() {
  const dispatch = useDispatch();
  const state = useSelector(({ fuse }: RootState) => fuse.message.state);
  const options = useSelector(({ fuse }: RootState) => fuse.message.options);

  const severity = options.variant ?? "error";

  return (
    <Snackbar {...options} open={state} onClose={() => dispatch(Actions.hideMessage())}>
      <Alert onClose={() => dispatch(Actions.hideMessage())} severity={severity}>
        {options.message}
      </Alert>
    </Snackbar>
  );
}

export default React.memo(FuseMessage);
