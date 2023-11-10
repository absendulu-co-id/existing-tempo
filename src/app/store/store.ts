// import * as SharedZustand from "shared-zustand";
import { createEmployeeSlice, EmployeeSlice } from "./slices/employee";
import { createHolidaySlice, HolidaySlice } from "./slices/holiday";
import { createImportSlice, ImportSlice } from "./slices/import";
import { createPayrollSlice, PayrollSlice } from "./slices/payroll";
import { createPayrollCreateSlice, PayrollCreateSlice } from "./slices/payrollCreate";
import { createPayrollReportSlice, PayrollReportSlice } from "./slices/payrollReport";
import { createSettingSlice, SettingSlice } from "./slices/setting";
import { original, produce } from "immer";
import { create, StateCreator, StoreApi, UseBoundStore } from "zustand";
import { createJSONStorage, devtools, PersistOptions, StateStorage, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// #region createSelectors
// https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};
// #endregion

// #region Persist Storage
// TODO Encryption+compression
const storage: StateStorage = {
  getItem: (name: string) => {
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const persistConfig: PersistOptions<Store> = {
  name: "root",
  onRehydrateStorage: (state) => {
    console.log("hydration starts");

    return (state, error) => {
      if (error) {
        console.log("an error happened during hydration", error);
      } else {
        console.log("hydration finished");
      }
    };
  },
  // TODO filter function
  // partialize: (state) =>
  //   Object.fromEntries(
  //     Object.entries(state).filter(([key]) => !["foo"].includes(key)),
  //   ),
  version: 1,
  skipHydration: true,
  storage: createJSONStorage(() => storage),
};

// #endregion

export const pushOrReplaceItemArray = <T extends object = any>(state: T[], property: keyof T, newItem: T) => {
  const i = original(state)!.findIndex((x) => x[property] == newItem[property]);
  if (i == -1) {
    state.push(newItem);
  } else {
    state[i] = newItem;
  }

  return state;
};

export interface Store {
  PayrollSlice: PayrollSlice;
  PayrollCreateSlice: PayrollCreateSlice;
  PayrollReportSlice: PayrollReportSlice;
  EmployeeSlice: EmployeeSlice;
  HolidaySlice: HolidaySlice;
  SettingSlice: SettingSlice;
  ImportSlice: ImportSlice;
  setStore: (fn: StoreApi<Store>["setState"]) => void;
}

const store: StateCreator<Store> = (...a) => ({
  ...createPayrollSlice(...a),
  ...createPayrollCreateSlice(...a),
  ...createPayrollReportSlice(...a),
  ...createEmployeeSlice(...a),
  ...createHolidaySlice(...a),
  ...createSettingSlice(...a),
  ...createImportSlice(...a),
  setStore: (fn: StoreApi<Store>["setState"]) => a[0](produce(a[1](), fn)),
});

export const useStore = createSelectors(
  create<
    Store,
    [
      // ["zustand/persist", Store],
      ["zustand/immer", Store],
      ["zustand/subscribeWithSelector", Store],
      ["zustand/devtools", Store],
    ]
  >(
    // persist(
    immer(subscribeWithSelector(devtools(store))),
    // persistConfig,
    // ),
  ),
);

// if (SharedZustand.isSupported()) {
//   if (process.env.NODE_ENV == "development") console.log("SharedZustand supported");
//   SharedZustand.share("PayrollSlice", useStore);
// }
