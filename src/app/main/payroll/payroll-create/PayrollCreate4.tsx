import { PayrollCreateStates } from "./PayrollCreate";
import { useStore } from "@/app/store/store";
import { Icon } from "@iconify-icon/react";
import { Button, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props<ParentState> {
  setState: <K extends keyof ParentState>(
    state:
      | ((prevState: Readonly<ParentState>) => Pick<ParentState, K> | ParentState | null)
      | (Pick<ParentState, K> | ParentState | null),
    callback?: () => void,
  ) => void;
  isStep4Done: boolean;
}

export const PayrollCreate4: React.FC<Props<PayrollCreateStates>> = ({ setState, ...props }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const setStore = useStore.getState().setStore;
  const payroll = useStore((state) => state.PayrollCreateSlice.payroll);

  return (
    <React.Fragment>
      <Typography variant="h5" component="h2" gutterBottom className="text-center">
        {t("create_payroll_done")}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom className="text-center" style={{ whiteSpace: "pre-line" }}>
        <Trans i18nKey="create_payroll_done_subtitle" components={{ b: <b /> }} />
      </Typography>

      <div className="display-block m-auto text-center my-32">
        <Button
          component={Link}
          to={`/payroll/master/${payroll.payrollId}`}
          variant="outlined"
          color="primary"
          className="mr-16"
        >
          {t("open_created_payroll")}
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:email" />}
          onClick={() => setState({ dialogConfirmationSend: true })}
          disabled={props.isStep4Done}
        >
          {t("save_as_final_and_send")}
        </Button>
      </div>
    </React.Fragment>
  );
};
