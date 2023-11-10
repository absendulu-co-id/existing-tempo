import { Store } from "../store";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import { StateCreator, StoreApi } from "zustand";

export interface PayrollReportSlice {
  loading: boolean;
  summary: any[];
  byComponent: any[];
  byDepartment: any[];

  actions: {
    resetState: () => void;
  };
}

type ThisStore = Pick<Store, "PayrollReportSlice"> & Partial<Store>;

export const createPayrollReportSlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<PayrollReportSlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      summary: [],
      byComponent: [],
      byDepartment: [],
    });
  };

  return {
    PayrollReportSlice: {
      ...getDefaultState(),
      actions: {
        resetState: () => {
          setState((state: Store) => {
            state.PayrollReportSlice = {
              ...getDefaultState(),
              actions: state.PayrollReportSlice.actions,
            };
          });
        },
      },
    },
  };
};
