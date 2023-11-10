import { pushOrReplaceItemArray, Store } from "../store";
import { PayrollService } from "@/app/services/payroll";
import {
  Payroll,
  PayrollBaseSalaryPeriod,
  PayrollComponent,
  PayrollTemplate,
  Payslip,
  RootObjectData,
  RootObjectMessage,
  RootObjectRows,
} from "@/interface";
import Axios from "axios";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import { StateCreator, StoreApi } from "zustand";

export interface PayrollSlice {
  loading: boolean;
  components: PayrollComponent[];
  templates: PayrollTemplate[];
  payrolls: Payroll[];

  actions: {
    fetchComponents: (payrollComponentId?: number) => Promise<void>;
    fetchTemplates: (employeeId?: string | string[]) => Promise<PayrollTemplate[] | null>;
    fetchPayrolls: (payrollId?: number, p?: { showFinal?: boolean }) => Promise<void>;
    fetchPayslips: (payrollId: number) => Promise<void>;
  };
}

type ThisStore = Pick<Store, "PayrollSlice"> & Partial<Store>;

export const createPayrollSlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<PayrollSlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      components: [],
      templates: [],
      payrolls: [],
    });
  };

  return {
    PayrollSlice: {
      ...getDefaultState(),
      actions: {
        fetchComponents: async (payrollComponentId?: number) => {
          setState((state: Store) => {
            state.PayrollSlice.loading = true;
          });

          const mapPayrollComponent = (x: PayrollComponent) => {
            if (!("id" in x)) {
              (x as any).id = x.payrollComponentId;
            }
            if ("amount" in x) {
              (x as any).amount = parseFloat(x.amount.toString()).toString();
            }
            return x;
          };

          if (payrollComponentId == null) {
            const res = await Axios.get<RootObjectData<PayrollComponent>>("v1/payroll-component");
            const data = res.data.data?.map(mapPayrollComponent);

            if (data != null) {
              setState((state: Store) => {
                state.PayrollSlice.components = data;
              });
            }
          } else {
            const res = await Axios.get<PayrollComponent | RootObjectMessage>(
              `v1/payroll-component/${payrollComponentId}`,
            );

            if (!("message" in res.data)) {
              const data = mapPayrollComponent(res.data as PayrollComponent);
              setState((state: Store) => {
                state.PayrollSlice.components = pushOrReplaceItemArray<PayrollComponent>(
                  state.PayrollSlice.components,
                  "payrollComponentId",
                  data,
                );
              });
            }
          }

          setState((state: Store) => {
            state.PayrollSlice.loading = false;
          });
        },
        fetchTemplates: async (employeeId?: string | string[]) => {
          setState((state: Store) => {
            state.PayrollSlice.loading = true;
          });

          const mapPayrollTemplate = (x: PayrollTemplate) => {
            if (!("id" in x)) {
              (x as any).id = x.employeeId;
            }
            x.payrollBaseSalary ??= {
              salary: 0,
              period: PayrollBaseSalaryPeriod.MONTHLY,
              employeeId: "",
            };
            // TODO
            // x.payrollBaseSalary ??= get().SettingSlice!.settingPrivates

            // if ("amount" in x) { (x as any).amount = parseFloat(x.amount.toString()).toString(); }
            return x;
          };

          let returnData: PayrollTemplate[] | null = null;

          if (employeeId == null) {
            const res = await Axios.get<RootObjectRows<PayrollTemplate>>("v1/payroll-template");
            const data = res.data.rows?.map(mapPayrollTemplate);

            if (data != null) {
              setState((state: Store) => {
                state.PayrollSlice.templates = data;
              });
              returnData = data;
            }
          } else if (Array.isArray(employeeId)) {
            const res = await Axios.get<RootObjectRows<PayrollTemplate>>("v1/payroll-template", {
              params: {
                employeeId: employeeId,
              },
            });
            const data = res.data.rows?.map(mapPayrollTemplate);

            if (data != null) {
              setState((state: Store) => {
                state.PayrollSlice.templates = data;
              });
              returnData = data;
            }
          } else {
            const res = await Axios.get<PayrollTemplate | RootObjectMessage>(`v1/payroll-template/${employeeId}`);
            if (!("message" in res.data)) {
              const data = mapPayrollTemplate(res.data as PayrollTemplate);

              setState((state: Store) => {
                state.PayrollSlice.templates = pushOrReplaceItemArray<PayrollTemplate>(
                  state.PayrollSlice.templates,
                  "employeeId",
                  data,
                );
              });
              returnData = [data];
            }
          }

          setState((state: Store) => {
            state.PayrollSlice.loading = false;
          });

          return returnData;
        },
        fetchPayrolls: async (payrollId?: number, p?: { showFinal?: boolean }) => {
          const showFinal = p?.showFinal ?? null;

          setState((state: Store) => {
            state.PayrollSlice.loading = true;
          });

          const map = (x: Payroll) => {
            if (!("id" in x)) {
              (x as any).id = x.payrollId;
            }

            x.cutoffStart = moment(x.cutoffStart);
            x.cutoffEnd = moment(x.cutoffEnd);

            const payslips = get().PayrollSlice!.payrolls.find(
              (y) => y.payrollId == x.payrollId && y.payslips != null && y.payslips.length != 0,
            )?.payslips;

            if (payslips != null) {
              x.payslips = payslips;
            }
            return x;
          };

          if (payrollId == null) {
            const res = await Axios.get<RootObjectData<Payroll>>("v1/payroll", {
              params: {
                per_page: 0,
                ...(showFinal != null && { isFinal: showFinal }),
              },
            });
            const data = res.data.data?.map(map);

            if (data != null) {
              setState((state: Store) => {
                state.PayrollSlice.payrolls = data;
              });
            }
          } else {
            const res = await Axios.get<Payroll | RootObjectMessage>(`v1/payroll/${payrollId}`, {
              params: {
                per_page: 0,
                ...(showFinal != null && { isFinal: showFinal }),
              },
            });

            if (!("message" in res.data)) {
              const data = map(res.data as Payroll);
              setState((state: Store) => {
                state.PayrollSlice.payrolls = pushOrReplaceItemArray<Payroll>(
                  state.PayrollSlice.payrolls,
                  "payrollId",
                  data,
                );
              });
            }
          }

          setState((state: Store) => {
            state.PayrollSlice.loading = false;
          });
        },
        fetchPayslips: async (payrollId: number) => {
          setState((state: Store) => {
            state.PayrollSlice.loading = true;
          });

          const map = (x: Payslip) => {
            if (!("id" in x)) {
              (x as any).id = x.payrollId;
            }

            x.workingDays = parseFloat(x.workingDays.toString());
            x.presentDays = parseFloat(x.presentDays.toString());
            x.leaveDays = parseFloat(x.leaveDays.toString());
            x.absentDays = parseFloat(x.absentDays.toString());
            x.lateDays = parseFloat(x.lateDays.toString());
            x.workingTime = parseFloat(x.workingTime.toString());
            x.salary = parseFloat(x.salary.toString());
            x.salaryProrateAmount = parseFloat(x.salaryProrateAmount.toString());
            x.overtimeHours = parseFloat(x.overtimeHours?.toString() ?? "0");

            const thp = PayrollService.calculateTakeHomePay({ template: x });
            x.takeHomePay = thp.takeHomePay;

            x.payslipDetails = x.payslipDetails.map((y) => {
              y.amount = parseFloat(y.amount.toString());
              y.multiplier = parseFloat(y.multiplier.toString());
              y.total = parseFloat(y.total.toString());
              return y;
            });

            return x;
          };

          const res = await Axios.get<RootObjectData<Payslip>>(`v1/payslip/${payrollId}`);
          const data = res.data.data?.map(map);

          if (data != null) {
            let payrollIndex = get().PayrollSlice.payrolls.findIndex((x) => x.payrollId === payrollId);
            if (payrollIndex == -1) {
              await get().PayrollSlice.actions.fetchPayrolls(payrollId);
              payrollIndex = get().PayrollSlice.payrolls.findIndex((x) => x.payrollId === payrollId);
            }

            setState((state: Store) => {
              state.PayrollSlice.payrolls[payrollIndex].payslips = data;
            });
          }

          setState((state: Store) => {
            state.PayrollSlice.loading = false;
          });
        },
      },
    },
  };
};
