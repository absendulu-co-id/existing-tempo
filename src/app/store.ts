import { quickPanel } from "./fuse-layouts/shared-components/quickPanel/store/reducers/quickPanel.reducer";
import { middleware } from "./store/middleware";
import { fuse } from "./store/reducers/fuse";
import { globalReducer } from "./store/reducers/global.reducer";
import { formMaker } from "@mid/store/formMaker/reducer.formMaker";
import { model } from "@mid/store/model/reducer.model";
import { configureStore } from "@reduxjs/toolkit";
import { auth } from "app/auth/store/reducers";

export const store = configureStore({
  middleware,
  reducer: {
    fuse,
    auth,
    globalReducer,
    formMaker,
    model,
    quickPanel,
    // user: userSlice,
  },
  // enhancers: enhancer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
