import { defaultThemeOptions, mustHaveThemeOptions } from "@fuse/FuseDefaultSettings";
import { createTheme } from "@material-ui/core/styles";
import merge from "lodash/merge";
import { defaultThemes } from "react-data-table-component";

export const materialTableTheme = createTheme(
  merge({}, defaultThemeOptions, mustHaveThemeOptions, {
    palette: {
      primary: {
        main: "#EFF5F1",
      },
      secondary: {
        main: "#78BC27",
      },
    },
  }),
);

export const reactTableCustomStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
};
