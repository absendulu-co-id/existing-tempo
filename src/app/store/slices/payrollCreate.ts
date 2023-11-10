import { Store } from "../store";
import { CalculateTakeHomepay, PayrollService } from "@/app/services/payroll";
import { PayrollComponent, PayrollCreation, PayrollTemplate, ReportRecapitulation } from "@/interface";
import { Employee, Holiday } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import { StateCreator, StoreApi } from "zustand";

export interface PayrollCreateSlice {
  loading: boolean;
  components: PayrollComponent[];
  templates: PayrollTemplate[];
  holidays: Holiday[];
  selectedEmployees: Employee[];
  activeStep: number;
  payroll: PayrollCreation;
  isCreatorHidden: boolean;
  recapitulations: ReportRecapitulation[];

  actions: {
    resetState: () => void;
    fetchTemplates: () => Promise<void>;
    fetchRecapitulations: (p?: { start?: moment.Moment; end?: moment.Moment; employeeIds?: string[] }) => Promise<void>;
    fetchHolidays: () => Promise<void>;
    calculateThp: (p: { employeeId: string; isCalculateAll?: boolean }) => CalculateTakeHomepay;
    calculateAllThp: () => void;
    createPayroll: () => Promise<boolean>;
  };
}

type ThisStore = Pick<Store, "PayrollCreateSlice"> & Partial<Store>;

export const createPayrollCreateSlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<PayrollCreateSlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      components: [],
      templates: [],
      holidays: [],
      selectedEmployees: [],
      activeStep: 1,
      payroll: {
        name: "",
        companyName: "",
        period: moment(),
        cutoffStart: moment().subtract(1, "month").set("date", 14),
        cutoffEnd: moment().set("date", 15),
        lateDispensation: "",
        creatorUserId: 0,
        isProtectPdf: true,
        isShowConfidential: true,
      },
      isCreatorHidden: false,
      recapitulations: [],
    });
  };

  return {
    PayrollCreateSlice: {
      ...getDefaultState(),
      actions: {
        resetState: () => {
          setState((state: Store) => {
            state.PayrollCreateSlice = {
              ...getDefaultState(),
              actions: state.PayrollCreateSlice.actions,
            };
          });
        },
        fetchTemplates: async () => {
          setState((state: Store) => {
            state.PayrollCreateSlice.loading = true;
          });
          const payrollTemplates = await get().PayrollSlice!.actions.fetchTemplates(
            get().PayrollCreateSlice.selectedEmployees.map((x) => x.employeeId),
          );
          if (payrollTemplates != null) {
            setState((state: Store) => {
              state.PayrollCreateSlice.templates = payrollTemplates;
            });
          }

          setState((state: Store) => {
            state.PayrollCreateSlice.loading = false;
          });
        },
        fetchRecapitulations: async (p?: { start?: moment.Moment; end?: moment.Moment; employeeIds?: string[] }) => {
          setState((state: Store) => {
            state.PayrollCreateSlice.loading = true;
          });

          const start = (p?.start ?? get().PayrollCreateSlice.payroll.cutoffStart).toISOString().split("T")[0];
          const end = (p?.end ?? get().PayrollCreateSlice.payroll.cutoffEnd).toISOString().split("T")[0];

          const data = await Axios.post<ReportRecapitulation[]>("recapitulation-report", {
            startDate: start,
            endDate: end,
            employees: p?.employeeIds ?? get().PayrollCreateSlice.selectedEmployees.map((x) => x.employeeId),
          });

          setState((state: Store) => {
            state.PayrollCreateSlice.loading = false;
            state.PayrollCreateSlice.recapitulations = data.data;
          });
        },
        fetchHolidays: async () => {},
        calculateThp: (p: { employeeId: string; isCalculateAll?: boolean }) => {
          const { employeeId, isCalculateAll } = p;
          const payrollCreateSlice = get().PayrollCreateSlice;

          const templateIdx = payrollCreateSlice.templates.findIndex((x) => x.employeeId == employeeId);
          if (templateIdx == -1) {
            throw new Error("calculateThp: employee not found");
          }

          const thp = PayrollService.calculate({
            template: cloneDeep(payrollCreateSlice.templates[templateIdx]),
            recapitulation:
              payrollCreateSlice.recapitulations.find(
                (x) => x.employeeId == payrollCreateSlice.templates[templateIdx].employeeId,
              ) ?? null,
            holidays: payrollCreateSlice.holidays,
            payroll: payrollCreateSlice.payroll,
            payrollComponents: payrollCreateSlice.components,
          });

          if (!isCalculateAll) {
            setState((state: Store) => {
              state.PayrollCreateSlice.templates[templateIdx] = thp.template;
            });
          }

          return thp;
        },
        calculateAllThp: () => {
          const payrollCreateSlice = get().PayrollCreateSlice;

          const templateTemp = payrollCreateSlice.templates.map((x) => {
            return payrollCreateSlice.actions.calculateThp({ employeeId: x.employeeId, isCalculateAll: true }).template;
          });

          setState((store: Store) => {
            store.PayrollCreateSlice.templates = templateTemp;
          });
        },
        createPayroll: async () => {
          setState((state: Store) => {
            state.PayrollCreateSlice.loading = true;
          });

          const finalPayroll = await PayrollService.createPayroll({
            templates: get().PayrollCreateSlice.templates,
            payroll: get().PayrollCreateSlice.payroll,
            payrollComponents: get().PayrollSlice!.components,
            recapitulations: get().PayrollCreateSlice.recapitulations,
            isCreatorHidden: get().PayrollCreateSlice.isCreatorHidden,
          });

          setState((state: Store) => {
            state.PayrollCreateSlice.loading = false;
          });

          if (finalPayroll != null) {
            setState((state: Store) => {
              state.PayrollCreateSlice.payroll = {
                ...finalPayroll,
                period: moment(finalPayroll.period),
                cutoffStart: moment(finalPayroll.cutoffStart),
                cutoffEnd: moment(finalPayroll.cutoffEnd),
              };
            });
            return true;
          }
          return false;
        },
      },
    },
  };
};
