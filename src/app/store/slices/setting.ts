import { Store } from "../store";
import Axios from "axios";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import { StateCreator, StoreApi } from "zustand";

export interface SettingSlice {
  loading: boolean;
  // settings: Setting[];
  settingPrivates: Record<string, string>;
  // settingPublics: Record<string, string>;

  actions: {
    resetState: () => void;
    fetchSettingPrivates: () => Promise<void>;
    editSetting: (key: string, value: string) => Promise<void>;
  };
}

type ThisStore = Pick<Store, "SettingSlice"> & Partial<Store>;

export const createSettingSlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<SettingSlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      settingPrivates: {},
    });
  };

  return {
    SettingSlice: {
      ...getDefaultState(),
      actions: {
        resetState: () => {
          setState((state: Store) => {
            state.SettingSlice = {
              ...getDefaultState(),
              actions: state.SettingSlice.actions,
            };
          });
        },
        fetchSettingPrivates: async () => {
          setState((state: Store) => {
            state.SettingSlice.loading = true;
          });

          const res = await Axios.get<Record<string, string>>("v1/setting/private");
          const data = res.data;

          setState((state: Store) => {
            state.SettingSlice.loading = false;
            state.SettingSlice.settingPrivates = data;
          });
        },
        editSetting: async (key: string, value: string) => {
          throw new Error("Not implemented");
          setState((state: Store) => {
            state.SettingSlice.loading = true;
          });

          await Axios.put<Record<string, string>>("v1/setting", {
            key,
            value,
          });

          setState((state: Store) => {
            state.SettingSlice.loading = false;
          });
        },
      },
    },
  };
};
