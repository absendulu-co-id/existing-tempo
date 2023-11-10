import { makeStyles } from "@material-ui/core";
import { PayrollTemplate, Payslip } from "interface";
import React from "react";
import { Theme } from "react-data-table-component";

interface Props {
  rowData: PayrollTemplate | Payslip;
  compact?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    "& th": {
      textAlign: "right",
      padding: "0.4rem 0.25rem",
      verticalAlign: "top",
    },
    "& td": {
      padding: "0.4rem 0.25rem",
      verticalAlign: "top",
    },
  },
  compact: {
    "& tr.compact-small-text": {
      fontSize: "8pt",
    },
    "& th": {
      textAlign: "right",
      padding: "1px",
    },
    "& td": {
      padding: "1px",
    },
  },
}));

const _PayrollEmployeeMiniTable: React.FC<Props> = ({ rowData, compact }) => {
  const classes = useStyles();

  const positionCode = "positionCode" in rowData ? rowData.positionCode : null;
  const departmentCode = "departmentCode" in rowData ? rowData.departmentCode : null;
  const areaName =
    ("areaIdAreas" in rowData ? rowData.areaIdAreas.map((x) => x.areaName).join(", ") : null) ??
    ("areaName" in rowData ? rowData.areaName : null);

  return (
    <table className={classes.table + " " + (compact ? classes.compact : "")}>
      <tbody>
        <tr>
          <th>NIK</th>
          <td>{rowData.employeeId}</td>
        </tr>
        <tr>
          <th>Nama</th>
          <td>{rowData.employeeName}</td>
        </tr>

        {(positionCode != null || rowData.positionName != null) && (
          <tr className="compact-small-text">
            <th>Posisi</th>
            <td>
              {positionCode ?? ""} {positionCode != null ? `(${rowData.positionName})` : rowData.positionName}
            </td>
          </tr>
        )}

        {(departmentCode != null || rowData.departmentName != null) && (
          <tr className="compact-small-text">
            <th>Departemen</th>
            <td>
              {departmentCode} {departmentCode != null ? `(${rowData.departmentName})` : rowData.departmentName}
            </td>
          </tr>
        )}

        {areaName != null && areaName != "" && (
          <tr className="compact-small-text">
            <th>Area</th>
            <td>{areaName}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const PayrollEmployeeMiniTable = React.memo(_PayrollEmployeeMiniTable);
