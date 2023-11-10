import dialog from "./dialog.reducer";
import message from "./message.reducer";
import navbar from "./navbar.reducer";
import navigation from "./navigation.reducer";
import routes from "./routes.reducer";
import settings from "./settings.reducer";
import { combineReducers } from "redux";

export const fuse = combineReducers({
  navigation,
  settings,
  navbar,
  message,
  dialog,
  routes,
});
