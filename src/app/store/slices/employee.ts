import { Store } from "../store";
import { RootObjectRows } from "@/interface";
import { Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import { StateCreator, StoreApi } from "zustand";

// CTRL+H Employee

export interface EmployeeSlice {
  loading: boolean;
  employees: Employee[];

  actions: {
    resetState: () => void;
    fetchEmployees: (employeeId?: string) => Promise<void>;
  };
}

type ThisStore = Pick<Store, "EmployeeSlice"> & Partial<Store>;

export const createEmployeeSlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<EmployeeSlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      employees: [],
    });
  };

  return {
    EmployeeSlice: {
      ...getDefaultState(),
      actions: {
        resetState: () => {
          setState((state: Store) => {
            state.EmployeeSlice = {
              ...getDefaultState(),
              actions: state.EmployeeSlice.actions,
            };
          });
        },
        fetchEmployees: async (employeeId?: string) => {
          setState((state: Store) => {
            state.EmployeeSlice.loading = true;
          });

          const map = (x: Employee) => {
            if (!("id" in x)) {
              (x as any).id = x.employeeId;
            }
            return x;
          };

          if (employeeId == null) {
            const res = await Axios.get<RootObjectRows<Employee>>("employees");
            const data = res.data.rows?.map(map);

            if (data != null) {
              setState((state: Store) => {
                state.EmployeeSlice.employees = data;
              });
            }
          } else {
            throw new Error("Not implemented");
            // const res = await Axios.get<Employee>(`employees/${employeeId}`);
            // res.data = map(res.data);

            // setState((state: Store) => {
            //   state.EmployeeSlice.employees = pushOrReplaceItemArray<Employee>(
            //     state.EmployeeSlice.employees,
            //     "employeeId",
            //     res.data,
            //   );
            // });
          }

          setState((state: Store) => {
            state.EmployeeSlice.loading = false;
          });
        },
      },
    },
  };
};
