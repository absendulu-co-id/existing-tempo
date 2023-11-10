import { TransferList } from "../components/TransferList";
import { Store, useStore } from "@/app/store/store";
import {
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props {}

export const _PayrollCreate1: React.FC<Props> = ({ ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectAllEmployee, setSelectAllEmployee] = useState<boolean>(false);

  const setStore = useStore.getState().setStore;

  const employees = useStore((state) => state.EmployeeSlice.employees);
  const payrollCreateStore = useStore((state) => state.PayrollCreateSlice);
  const payroll = payrollCreateStore.payroll;

  useEffect(() => {
    if (
      payrollCreateStore.selectedEmployees.length == employees.length &&
      payrollCreateStore.selectedEmployees.length != 0
    ) {
      setSelectAllEmployee(true);
    } else {
      setSelectAllEmployee(false);
    }
  }, [payrollCreateStore.selectedEmployees.length, employees.length]);

  const handleSelectAllEmployee = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setSelectAllEmployee(checked);
    setStore((store: Store) => {
      store.PayrollCreateSlice.selectedEmployees = checked ? employees : [];
    });
  };

  return (
    <Container maxWidth="md">
      <h2 className="mb-16">{t("period")}</h2>

      <Grid container spacing={2} className="mb-16" justifyContent="center">
        <Grid item xs={12} md={6}>
          <DatePicker
            value={payroll.period.toDate()}
            onChange={(date) => {
              const start = moment(payroll.period).subtract(1, "month").set("date", 14);
              const end = moment(payroll.period).set("date", 15);

              setStore((store: Store) => {
                store.PayrollCreateSlice.payroll.period = moment(date);
              });

              if (payroll.cutoffStart.isSame(start) && payroll.cutoffEnd.isSame(end)) {
                setStore((store: Store) => {
                  store.PayrollCreateSlice.payroll.cutoffStart = moment(date).subtract(1, "month").set("date", 14);
                  store.PayrollCreateSlice.payroll.cutoffEnd = moment(date).set("date", 15);
                });
              }
            }}
            format="MMMM YYYY"
            views={["month", "year"]}
            maxDate={moment().add(1, "year")}
            variant={fullScreen ? "dialog" : "inline"}
            inputVariant="outlined"
            label={t("period")}
            fullWidth
            required
            autoOk
          />
        </Grid>
      </Grid>

      <h2 className="mb-16">{t("payment_cutoff")}</h2>

      <Grid container spacing={2} className="mb-16">
        <Grid item xs={12} md={6}>
          <DatePicker
            value={payroll.cutoffStart.toDate()}
            onChange={(date) =>
              setStore((store: Store) => {
                store.PayrollCreateSlice.payroll.cutoffStart = moment(date);
              })
            }
            format="dddd, ll"
            variant={fullScreen ? "dialog" : "inline"}
            inputVariant="outlined"
            maxDate={moment().add(1, "year")}
            label={t("start")}
            fullWidth
            required
            autoOk
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePicker
            value={payroll.cutoffEnd.toDate()}
            onChange={(date) => {
              setStore((store: Store) => {
                store.PayrollCreateSlice.payroll.cutoffEnd = moment(date);
              });
            }}
            format="dddd, ll"
            variant={fullScreen ? "dialog" : "inline"}
            inputVariant="outlined"
            maxDate={moment().add(1, "year")}
            label={t("end")}
            fullWidth
            required
            autoOk
          />
        </Grid>
      </Grid>

      <h2 className="mb-16">{t("employee")}</h2>
      <div className="text-center">
        <FormControlLabel
          control={<Checkbox checked={selectAllEmployee} onChange={handleSelectAllEmployee} />}
          label={t("select_all", { t: t("employee").toLowerCase() })}
        />
        <TransferList<Employee>
          idPropertyName="employeeId"
          data={employees}
          onChange={(selected) => {
            setStore((store: Store) => {
              store.PayrollCreateSlice.selectedEmployees = selected;
            });
          }}
          selected={payrollCreateStore.selectedEmployees}
          title={t("employee").toString()}
          render={(x) => `${x.employeeName ?? ""}`}
          renderSecondary={(x) => {
            let suffix = "";
            if (x.positionName != null || x.departmentName) {
              suffix += " - ";
            }
            if (x.positionName != null) {
              suffix += `${x.positionName} `;
            }
            if (x.positionName != null && x.departmentName != null) {
              suffix += `| ${x.departmentName}`;
            } else {
              suffix += x.departmentName ?? "";
            }

            return `${x.employeeId} ${suffix}`;
          }}
        />
      </div>
    </Container>
  );
};

export const PayrollCreate1 = React.memo(_PayrollCreate1);
