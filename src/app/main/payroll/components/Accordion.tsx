import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  withStyles,
} from "@material-ui/core";

export const PayrollAccordion = withStyles((theme) => ({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
}))(MuiAccordion);

export const PayrollAccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 24,
    "&$expanded": {
      minHeight: 24,
    },
  },
  content: {
    margin: "8px 0",
    "&$expanded": {
      margin: "8px 0",
    },
  },
  expandIcon: {
    padding: "4px 12px",
  },
  expanded: {},
}))(MuiAccordionSummary);

export const PayrollAccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiAccordionDetails);
