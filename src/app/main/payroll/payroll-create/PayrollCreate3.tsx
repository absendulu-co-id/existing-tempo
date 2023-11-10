import { PayrollCreateStates } from "./PayrollCreate";
import { Store, useStore } from "@/app/store/store";
import { TextFieldFormsy } from "@fuse";
import { formsyErrorMessage } from "@fuse/components/formsy/FormsyErrorMessage";
import { Icon } from "@iconify-icon/react";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Typography,
} from "@material-ui/core";
import Axios from "axios";
import Formsy from "formsy-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props<ParentState> {
  setState: <K extends keyof ParentState>(
    state:
      | ((prevState: Readonly<ParentState>) => Pick<ParentState, K> | ParentState | null)
      | (Pick<ParentState, K> | ParentState | null),
    callback?: () => void,
  ) => void;
}

export const PayrollCreate3: React.FC<Props<PayrollCreateStates>> = ({ setState, ...props }) => {
  const { t } = useTranslation();

  const setStore = useStore.getState().setStore;
  const payrollCreateStore = useStore((state) => state.PayrollCreateSlice);
  const payroll = payrollCreateStore.payroll;

  const getData = async () => {
    if (payroll.companyName == "") {
      const res = await Axios.get("auth/userDetail/adminOrg");
      const user = res.data;

      setStore((store: Store) => {
        const p = store.PayrollCreateSlice.payroll;

        if (!p.creatorUserId) p.creatorUserId = user.userId;
        if (!p.companyName) p.companyName = user.defaultOrganizationAccess.organizationName;
        if (!p.companyAddress) p.companyAddress = user.defaultOrganizationAccess.organizationAddress;
        if (!p.companyPhone) p.companyPhone = user.defaultOrganizationAccess.organizationPhone;
        if (!p.creatorName) p.creatorName = user.accountName;
        if (!p.creatorPosition) p.creatorPosition = user.defaultEmployee?.defaultPositionId;

        p.header ??= "";
        p.footer ??= "";
      });
    }
  };

  const handleOnChange = (event: React.ChangeEvent<{ value: unknown; name: string }>) => {
    useStore.getState().setStore((store: Store) => {
      store.PayrollCreateSlice.payroll[event.target.name] = event.target.value;
    });
  };

  const handleOnChangeManual = (name, value) => {
    useStore.getState().setStore((store: Store) => {
      store.PayrollCreateSlice.payroll[name] = value;
    });
  };

  useEffect(() => {
    void getData();
  }, []);

  return (
    <Formsy onValid={() => setState({ step3Valid: true })} onInvalid={() => setState({ step3Valid: false })}>
      <Typography variant="h6" component="h2" gutterBottom>
        {t("company")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextFieldFormsy
            name="companyName"
            label={t("company_name").toString()}
            value={payroll.companyName}
            variant="outlined"
            required
            debounce
            onChange={handleOnChange}
            validations={"isExisty"}
            validationError={formsyErrorMessage(t, t("company_name")).isExisty}
            validationErrors={formsyErrorMessage(t, t("company_name"))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldFormsy
            name="companyPhone"
            label={t("company_phone").toString()}
            value={payroll.companyPhone}
            variant="outlined"
            required
            debounce
            multiline
            onChange={handleOnChange}
            validations={"isExisty"}
            validationError={formsyErrorMessage(t, t("company_phone")).isExisty}
            validationErrors={formsyErrorMessage(t, t("company_phone"))}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextFieldFormsy
            name="companyAddress"
            label={t("company_address").toString()}
            value={payroll.companyAddress}
            variant="outlined"
            required
            debounce
            multiline
            minRows={2}
            onChange={handleOnChange}
            validations={"isExisty"}
            validationError={formsyErrorMessage(t, t("company_address")).isExisty}
            validationErrors={formsyErrorMessage(t, t("company_address"))}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: "32px" }}>
        {t("creator_payslip")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!payrollCreateStore.isCreatorHidden}
                onChange={(e, checked) =>
                  setStore((store: Store) => {
                    store.PayrollCreateSlice.isCreatorHidden = !checked;
                  })
                }
              />
            }
            label={t("show_payslip_creator")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldFormsy
            name="creatorName"
            label={t("name").toString()}
            value={payroll.creatorName}
            variant={payrollCreateStore.isCreatorHidden ? "filled" : "outlined"}
            debounce
            disabled={payrollCreateStore.isCreatorHidden}
            onChange={handleOnChange}
            validationError={formsyErrorMessage(t, t("name")).isExisty}
            validationErrors={formsyErrorMessage(t, t("name"))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldFormsy
            name="creatorPosition"
            label={t("position").toString()}
            value={payroll.creatorPosition}
            variant={payrollCreateStore.isCreatorHidden ? "filled" : "outlined"}
            debounce
            disabled={payrollCreateStore.isCreatorHidden}
            onChange={handleOnChange}
            validationError={formsyErrorMessage(t, t("position")).isExisty}
            validationErrors={formsyErrorMessage(t, t("position"))}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: "32px" }}>
        {t("notes")}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        Untuk menulis catatan di slip gaji yang akan diterima karyawan
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextFieldFormsy
            name="header"
            label={t("header").toString()}
            value={payroll.header}
            variant="outlined"
            multiline
            debounce
            minRows={2}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFieldFormsy
            name="footer"
            label={t("footer").toString()}
            value={payroll.footer}
            variant="outlined"
            multiline
            debounce
            minRows={2}
            onChange={handleOnChange}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: "32px" }}>
        {t("others")}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <List>
            <ListItem key={1}>
              <ListItemIcon>
                <Icon icon="mdi:lock" />
              </ListItemIcon>
              <ListItemText primary={t("show_confidential_text")} secondary={t("show_confidential_text_desc")} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  onChange={() => handleOnChangeManual("isShowConfidential", !payroll.isShowConfidential)}
                  checked={payroll.isShowConfidential}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider key={2} variant="inset" component="li" />

            <ListItem key={3}>
              <ListItemIcon>
                <Icon icon="mdi:lock" />
              </ListItemIcon>
              <ListItemText primary={t("enable_protect_pdf")} secondary={t("enable_protect_pdf_desc")} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  onChange={() => handleOnChangeManual("isProtectPdf", !payroll.isProtectPdf)}
                  checked={payroll.isProtectPdf}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Formsy>
  );
};
