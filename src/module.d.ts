declare module "jss-extend";

declare module "sweetalert2/dist/sweetalert2.js" {
  export * from "sweetalert2";
  // "export *" does not matches the default export, so do it explicitly.
  export { default } from "sweetalert2";
}
