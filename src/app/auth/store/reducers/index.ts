import login from "./login.reducer";
import user from "./user.reducer";
import { combineReducers } from "redux";

export const auth = combineReducers({
  user,
  login,
});
