import { pushOrReplaceItemArray, Store } from "../store";
import { RootObjectData } from "@/interface";
import { Import } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import { produce } from "immer";
import cloneDeep from "lodash/cloneDeep";
import { CreationAttributes } from "sequelize";
import { StateCreator, StoreApi } from "zustand";

export interface ImportTableColumn {
  type: {
    options?: {
      length?: number;
      values?: string[];
    };
    name: string;
  };
  allowNull?: boolean;
  primaryKey?: true;
}

export interface ImportSlice {
  loading: boolean;
  tables: Record<string, Record<string, ImportTableColumn> | null>;
  imports: Import[];

  actions: {
    resetState: () => void;
    fetchTables: (tableName?: string) => Promise<void>;
    fetchImports: (importId?: number) => Promise<void>;
    createImport: (dataImport: CreationAttributes<Import>) => Promise<Import>;
    importRetry: (importId: number) => Promise<void>;
    importContinue: (importId: number) => Promise<void>;
  };
}

type ThisStore = Pick<Store, "ImportSlice"> & Partial<Store>;

export const createImportSlice: StateCreator<ThisStore> = (set, get): ThisStore => {
  const setState = (fn: StoreApi<Store>["setState"]) => set(produce(get(), fn));

  const getDefaultState: () => Omit<ImportSlice, "actions"> = () => {
    return cloneDeep({
      loading: false,
      tables: {},
      imports: [],
    });
  };

  return {
    ImportSlice: {
      ...getDefaultState(),
      actions: {
        resetState: () => {
          setState((state: Store) => {
            state.ImportSlice = {
              ...getDefaultState(),
              actions: state.ImportSlice.actions,
            };
          });
        },
        fetchTables: async (tableName?: string) => {
          setState((state: Store) => {
            state.ImportSlice.loading = true;
          });

          if (tableName == null) {
            const res = await Axios.get<string[]>("v1/import/tables");
            const data = res.data;

            if (!("message" in res.data) && res.data != null) {
              const recordData = data.reduce((acc, curr) => ((acc[curr] = null), acc), {});

              setState((state: Store) => {
                for (const key of Object.keys(recordData)) {
                  if (state.ImportSlice.tables[key] == null) {
                    state.ImportSlice.tables[key] = recordData[key];
                  }
                }
              });
            }
          } else {
            const res = await Axios.get<Record<string, ImportTableColumn>>(`v1/import/table/${tableName}`);

            if (!("message" in res.data)) {
              setState((state: Store) => {
                state.ImportSlice.tables[tableName] = res.data;
              });
            }
          }

          setState((state: Store) => {
            state.ImportSlice.loading = false;
          });
        },
        fetchImports: async (importId?: number) => {
          setState((state: Store) => {
            state.ImportSlice.loading = true;
          });

          const map = (x: Import) => {
            if (!("id" in x)) {
              (x as any).id = x.importId;
            }
            return x;
          };

          if (importId == null) {
            const res = await Axios.get<RootObjectData<Import>>("v1/import", {
              params: {
                per_page: 0,
              },
            });
            const data = res.data.data?.map(map);

            if (data != null) {
              setState((state: Store) => {
                state.ImportSlice.imports = data;
              });
            }
          } else {
            const res = await Axios.get<Import>(`v1/import/${importId}`);

            if (!("message" in res.data)) {
              const data = map(res.data);
              setState((state: Store) => {
                state.ImportSlice.imports = pushOrReplaceItemArray<Import>(state.ImportSlice.imports, "importId", data);
              });
            }
          }

          setState((state: Store) => {
            state.ImportSlice.loading = false;
          });
        },
        createImport: async (dataImport: CreationAttributes<Import>) => {
          setState((state: Store) => {
            state.ImportSlice.loading = true;
          });

          (dataImport.data as any[]).forEach((x) => {
            if ("id" in x) {
              delete x.id;
            }
          });

          const res = await Axios.post<Import>("v1/import", dataImport);

          setState((state: Store) => {
            state.ImportSlice.loading = false;
          });

          return res.data;
        },
        importRetry: async (importId?: number) => {
          setState((state: Store) => {
            state.ImportSlice.loading = true;
          });

          const res = await Axios.get<string[]>(`v1/import/retry/${importId}`);

          setState((state: Store) => {
            state.ImportSlice.loading = false;
          });
        },
        importContinue: async (importId?: number) => {
          setState((state: Store) => {
            state.ImportSlice.loading = true;
          });

          const res = await Axios.get<string[]>(`v1/import/continue/${importId}`);

          setState((state: Store) => {
            state.ImportSlice.loading = false;
          });
        },
      },
    },
  };
};
