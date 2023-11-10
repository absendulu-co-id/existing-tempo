// import { createLogger } from "redux-logger";
import { Middleware } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";

export const middleware: Middleware[] = [];

middleware.push(promise);
if (process.env.NODE_ENV === "development") {
  // middleware.push(createLogger());
}
middleware.push(thunk);
