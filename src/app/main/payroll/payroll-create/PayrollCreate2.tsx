import { PayrollBaseSalaryMiniTable } from "../components/PayrollBaseSalaryMiniTable";
import { PayrollEmployeeMiniTable } from "../components/PayrollEmployeeMiniTable";
import { PayrollRecapitulationMiniTable } from "../components/PayrollRecapitulationMiniTable";
import { PayrollTemplateFormComponent } from "../components/PayrollTemplateFormComponent";
import { PayrollTemplateComponentMiniTable } from "../payroll-template/components/PayrollTemplateComponentMiniTable";
import { Store, useStore } from "@/app/store/store";
import { Icon } from "@iconify-icon/react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import { MyMaterialTable } from "app/components/MyMaterialTable";
import { PayrollAmountType, PayrollComponentType, PayrollTemplate } from "interface";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props {
  // onRecalculate: (
  //   emplyoeeId: string,
  //   baseSalary: CreationAttributes<PayrollBaseSalary>,
  //   callback?: () => void,
  // ) => void | Promise<void>;
}

export const _PayrollCreate2: React.FC<Props> = ({ ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const [dialogEditOpen, setDialogEditOpen] = useState<boolean>(false);
  const [dialogEdit, setDialogEdit] = useState<string | null>(null);
  const [holidayCount, setHolidayCount] = useState<number>(0);

  const setStore = useStore.getState().setStore;

  const holidayStore = useStore((state) => state.HolidaySlice);
  const payrollComponents = useStore((state) => state.PayrollSlice.components);
  const payrollCreateStore = useStore((state) => state.PayrollCreateSlice);
  const payroll = payrollCreateStore.payroll;

  useEffect(() => {
    void getData();
  }, [payroll.cutoffEnd, payroll.cutoffStart]);

  useEffect(() => {
    let _holidayCount = 0;
    holidayStore.holidays.forEach((x) => {
      for (let i = 1; i < x.duration; i++) {
        _holidayCount++;
      }
      _holidayCount++;
    });
    setHolidayCount(_holidayCount);
  }, [holidayStore.holidays]);

  const getData = async () => {
    await Promise.all([
      payrollCreateStore.actions.fetchRecapitulations(),
      holidayStore.actions.fetchHolidays({ start: payroll.cutoffStart, end: payroll.cutoffEnd }),
      payrollCreateStore.actions.fetchTemplates(),
    ]);

    payrollCreateStore.actions.calculateAllThp();
  };

  const handleEditSubmit = (form: Partial<PayrollTemplate>, model: PayrollTemplate) => {
    const index = payrollCreateStore.templates.findIndex((x) => x.employeeId == dialogEdit);
    if (index == -1) throw new Error("Cannot find payroll");

    const components = form.payrollComponentEmployees?.map((x1) => {
      const x = { ...x1 };

      delete (x as any).employeeId;
      delete (x as any).createdAt;
      delete (x as any).updatedAt;
      if (x.payrollComponentEmployeeId != null && x.payrollComponentEmployeeId < 1) delete x.payrollComponentEmployeeId;

      if (x.amountType != PayrollAmountType.EXACT) {
        (x as any).amount = x.amount?.toString().toDecimal().toString();
      } else {
        (x as any).total = x.amount;
      }
      console.log(x);
      return x;
    });

    setStore((store: Store) => {
      if (components != null) {
        store.PayrollCreateSlice.templates[index].payrollComponentEmployees = components;
      }

      store.PayrollCreateSlice.templates[index].payrollBaseSalary = {
        ...form.payrollBaseSalary,
        period: model.payrollBaseSalary!.period,
        salary: model.payrollBaseSalary!.salary,
        prorate: model.payrollBaseSalary!.prorate,
        prorateManualDayCount: 0,
        employeeId: "",
      };
    });

    payrollCreateStore.actions.calculateThp({ employeeId: dialogEdit! });

    setDialogEditOpen(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} justifyContent="space-around" alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card variant="outlined" className="h-full">
            <CardContent>
              <Typography variant="body1" component="h2" color="textSecondary" gutterBottom>
                {t("period")}
              </Typography>
              <Typography variant="h6" component="p">
                {payroll.period.format("MMMM YYYY")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" className="h-full">
            <CardContent>
              <Typography variant="body1" component="h2" color="textSecondary" gutterBottom>
                {t("payment_cutoff")}
              </Typography>
              <Typography variant="h6" component="p">
                {payroll.cutoffStart.isSame(payroll.cutoffEnd, "y")
                  ? payroll.cutoffStart.format("DD MMMM")
                  : payroll.cutoffStart.format("LL")}
                &nbsp;-&nbsp;
                {payroll.cutoffEnd.format("LL")}
              </Typography>

              {holidayStore.holidays.length != 0 && (
                <Typography variant="body1" component="p">
                  <Tooltip
                    title={
                      <React.Fragment>
                        {holidayStore.holidays.map((x, i) => {
                          const holidayMoreThanADay: string[] = [];
                          for (let i = 1; i < x.duration; i++) {
                            holidayMoreThanADay.push(
                              `${moment(x.startDate).add(i, "day").format("DD/MM")}: ${x.holidayName}`,
                            );
                          }

                          return (
                            <React.Fragment key={i}>
                              <p>{`${moment(x.startDate).format("DD/MM")}: ${x.holidayName}`}</p>
                              {holidayMoreThanADay.map((y, j) => (
                                <p key={`${i} ${j}`}>{y}</p>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    }
                  >
                    <span>Libur: {t("day", { count: holidayCount })}</span>
                  </Tooltip>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" className="h-full">
            <CardContent>
              <Typography variant="body1" component="h2" color="textSecondary" gutterBottom>
                {t("number_of_employees")}
              </Typography>
              <Typography variant="h6" component="p"></Typography>
              <Typography variant="h6" component="h2">
                {t("employee", { count: payrollCreateStore.selectedEmployees.length })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {payrollCreateStore.templates.length != 0 && (
        <MyMaterialTable<PayrollTemplate>
          data={payrollCreateStore.templates}
          columns={[
            {
              title: t("employee"),
              width: 150,
              render: (rowData) => <PayrollEmployeeMiniTable rowData={rowData} compact />,
            },
            {
              title: t("salary"),
              width: 250,
              render: (rowData) => {
                const recapitulation = payrollCreateStore.recapitulations.find(
                  (x) => x.employeeId == rowData.employeeId,
                );

                return (
                  <React.Fragment>
                    <PayrollBaseSalaryMiniTable rowData={rowData} />
                    <hr />
                    {recapitulation == null && (
                      <Alert severity="warning">Tidak ada rekapitulasi untuk karyawan ini</Alert>
                    )}
                    {recapitulation != null && <PayrollRecapitulationMiniTable recapitulation={recapitulation} />}
                    <hr />
                  </React.Fragment>
                );
              },
            },
            {
              title: t("component"),
              width: 400,
              render: (rowData) => (
                <React.Fragment>
                  <PayrollTemplateComponentMiniTable
                    componentType={PayrollComponentType.EARNING}
                    payrollComponentEmployees={rowData.payrollComponentEmployees}
                    payrollComponents={payrollComponents}
                    isCreatePayroll
                  />
                  <PayrollTemplateComponentMiniTable
                    componentType={PayrollComponentType.DEDUCTION}
                    payrollComponentEmployees={rowData.payrollComponentEmployees}
                    payrollComponents={payrollComponents}
                    isCreatePayroll
                  />
                  <PayrollTemplateComponentMiniTable
                    componentType={PayrollComponentType.BENEFIT}
                    payrollComponentEmployees={rowData.payrollComponentEmployees}
                    payrollComponents={payrollComponents}
                    isCreatePayroll
                  />
                  <p>
                    <Icon icon="mdi:creation" /> {t("payroll_component_customized")}
                  </p>
                  <p className="text-center m-8">
                    <Typography component="span" variant="subtitle1" className="mr-8">
                      {t("take_home_pay")}
                    </Typography>
                    <Typography component="span" variant="h6">
                      <MyFormattedNumber value={rowData.takeHomePay ?? 0} />
                    </Typography>
                  </p>
                </React.Fragment>
              ),
            },
          ]}
          actions={[
            {
              icon: () => <Icon icon="mdi:edit" />,
              tooltip: "Ubah",
              onClick: (event, data) => {
                setDialogEditOpen(true);
                if (!Array.isArray(data)) {
                  setDialogEdit(data.employeeId);
                }
              },
            },
          ]}
          options={{
            rowStyle: (data) => {
              let style: React.CSSProperties = { verticalAlign: "top" };
              if (data.payrollBaseSalary?.salary == null || data.payrollBaseSalary.salary == 0) {
                style = {
                  ...style,
                  backgroundColor: red[400],
                };
              }

              return style;
            },
          }}
          style={{
            marginTop: 16,
          }}
        />
      )}

      <Dialog open={dialogEditOpen} onClose={() => setDialogEditOpen(false)} scroll="paper" fullScreen>
        <DialogTitle>{t("edit_salary_component")}</DialogTitle>
        <DialogContent>
          <Container>
            {payrollCreateStore.templates.find((x) => x.employeeId == dialogEdit) != null && (
              <PayrollTemplateFormComponent
                onSubmit={handleEditSubmit}
                isCreatePayroll
                payrollTemplate={payrollCreateStore.templates.find((x) => x.employeeId == dialogEdit)!}
                renderAction={(isFormValid) => (
                  <DialogActions>
                    <Button onClick={() => setDialogEditOpen(false)} color="default">
                      {t("cancel")}
                    </Button>
                    <Button color="primary" autoFocus type="submit" disabled={!isFormValid}>
                      {t("save")}
                    </Button>
                  </DialogActions>
                )}
              />
            )}
          </Container>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export const PayrollCreate2 = React.memo(_PayrollCreate2);
