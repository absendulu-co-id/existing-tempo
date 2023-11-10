import { Icon } from "iconify-icon";

declare global {
  interface String {
    toCapitalCase: () => string;
    toTitleCase: (ignoreAllCaps: boolean = true) => string;
    toSnakeCase: () => string;
    toDecimal: () => number;
  }
  namespace JSX {
    interface IntrinsicElements {
      ["iconify-icon"]: typeof Icon;
    }
  }
}
export {};
