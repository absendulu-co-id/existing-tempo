import { Store } from "../store";
import { Holiday } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import { StateCreator, StoreApi } from "zustand";

export interface HolidaySlice {
  loading: boolean;
  holidays: Holiday[];

  actions: {
    resetState: () => void;
    fetchHolidays: (p: { start: moment.Moment; end: moment.Moment }) => Promise<void>;
  };
}

type ThisStore = Pick<Store, "HolidaySlice"> & Partial<Store>;

export const createHolidaySlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<HolidaySlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      holidays: [],
    });
  };

  return {
    HolidaySlice: {
      ...getDefaultState(),
      actions: {
        resetState: () => {
          setState((state: Store) => {
            state.HolidaySlice = {
              ...getDefaultState(),
              actions: state.HolidaySlice.actions,
            };
          });
        },
        fetchHolidays: async (p: { start: moment.Moment; end: moment.Moment }) => {
          setState((state: Store) => {
            state.HolidaySlice = {
              ...state.HolidaySlice,
              loading: true,
            };
          });

          const start = p.start.toISOString().split("T")[0];
          const end = p.end.toISOString().split("T")[0];

          const { data } = await Axios.get<Holiday[]>("v1/holiday", {
            params: {
              per_page: 0,
              start,
              end,
            },
          });

          if (Array.isArray(data)) {
            setState((state: Store) => {
              state.HolidaySlice.holidays = data;
            });
          }
          setState((state: Store) => {
            state.HolidaySlice.loading = false;
          });
        },
      },
    },
  };
};
