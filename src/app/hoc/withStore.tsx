/* eslint-disable react/display-name */
import { Store, useStore } from "@/app/store/store";
import React from "react";

export interface WithStore {
  store: Store;
}

export const withStore =
  <P extends object>(
    BaseComponent: React.ComponentType<P & WithStore>,
  ): React.FC<React.ComponentProps<any> & WithStore> =>
  (props: any) => {
    const store = useStore();
    return <BaseComponent {...props} store={store} />;
  };
