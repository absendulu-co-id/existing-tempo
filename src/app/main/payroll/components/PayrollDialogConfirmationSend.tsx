import { useStore } from "@/app/store/store";
import { TextFieldFormsy } from "@fuse";
import { formsyErrorMessage } from "@fuse/components/formsy/FormsyErrorMessage";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Axios from "axios";
import Formsy from "formsy-react";
import { Payslip } from "interface";
import React, { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface Props {
  payrollId?: number;
  dialogOpenState: [boolean, Dispatch<boolean>];
  loadingState: [boolean, Dispatch<boolean>];

  onSuccess?: () => void | Promise<void>;
}

export const PayrollDialogConfirmationSend: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [dialogOpen, setDialogOpen] = props.dialogOpenState;
  const [loading, setLoading] = props.loadingState;
  const [isFormValid, setIsFormValid] = useState(false);

  const payslips = useStore(
    (state) => state.PayrollSlice.payrolls.find((x) => x.payrollId == props.payrollId)?.payslips,
  );

  const getPayslips = async () => {
    if (payslips != null || props.payrollId == null || useStore.getState().PayrollSlice.loading) return;

    await useStore.getState().PayrollSlice.actions.fetchPayslips(props.payrollId);
  };

  useEffect(() => {
    void getPayslips();
  }, [props.payrollId, dialogOpen]);

  const onConfirm = async (model: { payslip: Pick<Payslip, "email">[] }) => {
    setDialogOpen(false);
    const resSwal = await Swal.fire({
      icon: "question",
      title: t("confirmation").toString(),
      html: "Apakah Anda yakin ingin mengubah payroll ini menjadi final?<br><b>ANDA TIDAK DAPAT MENGUBAH PAYROLL INI KEMBALI</b>",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
    });

    if (resSwal.isConfirmed) {
      if (props.payrollId == null) throw new Error("Payroll ID is required");

      setLoading(true);
      try {
        if (payslips != null) {
          const data = model.payslip.map((x, i) => {
            return {
              email: x.email,
              payslipId: payslips[i].payslipId,
            };
          });
          await Axios.patch(`v1/payslip/bulk/${props.payrollId}`, data);
        }

        await Promise.all([
          Axios.put(`v1/payroll/${props.payrollId}`, {
            isFinal: true,
          }),
          Axios.post(`/v1/payslip/generate-and-send/${props.payrollId}`),
        ]);

        await Swal.fire({
          icon: "success",
          title: t("success").toString(),
          text: t("confirmation_send_payslip").toString(),
        });
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: t("error").toString(),
          text: error.message,
        });
      } finally {
        setLoading(false);
        if (props.onSuccess != null) {
          void props.onSuccess();
        }
      }
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      fullWidth
      scroll="paper"
      maxWidth="md"
    >
      <Formsy onValid={() => setIsFormValid(true)} onInvalid={() => setIsFormValid(false)} onValidSubmit={onConfirm}>
        <DialogTitle>Konfirmasi Alamat Email Karyawan</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>{t("employee_id")}</TableCell>
                  <TableCell>{t("name")}</TableCell>
                  <TableCell>{t("position")}</TableCell>
                  <TableCell>{t("department")}</TableCell>
                  <TableCell>{t("email")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payslips?.map((payslip, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{payslip.employeeId}</TableCell>
                      <TableCell>{payslip.employeeName}</TableCell>
                      <TableCell>{payslip.positionName}</TableCell>
                      <TableCell>{payslip.departmentName}</TableCell>
                      <TableCell>
                        <TextFieldFormsy
                          name={`payslip[${i}].email`}
                          value={payslip.email}
                          required
                          fullWidth
                          validations="isExisty,isEmail"
                          validationError={formsyErrorMessage(t, t("employee_email")).isExisty}
                          validationErrors={formsyErrorMessage(t, t("employee_email"))}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDialogOpen(false)} color="primary">
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={!isFormValid} color="primary" autoFocus>
            {t("send")}
          </Button>
        </DialogActions>
      </Formsy>
    </Dialog>
  );
};
