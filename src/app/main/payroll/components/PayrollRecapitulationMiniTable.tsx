import { makeStyles, Theme, Typography } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import { ReportRecapitulation } from "interface";
import React from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({
  totalWorkingDays: {},
  totalPresent: {
    color: theme.palette.primary.dark,
  },
  totalLeave: {
    color: blue[800],
  },
  totalAbsent: {
    color: red[800],
  },
}));

interface Props {
  recapitulation: Partial<ReportRecapitulation>;
}

export const PayrollRecapitulationMiniTable: React.FC<Props> = ({ recapitulation }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <table style={{ borderSpacing: 0 }}>
      <tbody>
        <tr className={classes.totalWorkingDays}>
          <th className="p-1">
            <Typography variant="caption" color="textSecondary">
              {t("total_working_days")}
            </Typography>
          </th>
          <td className="p-1">
            <Typography variant="body2" component="span" color="textSecondary">
              {t("day", { count: recapitulation.workingDay })}
            </Typography>
          </td>
        </tr>
        <tr className={classes.totalPresent}>
          <th className="p-1">
            <Typography variant="caption">{t("total_present")}</Typography>
          </th>
          <td className="p-1">
            <Typography variant="subtitle2" component="span">
              {t("day", { count: recapitulation.attendanceWorkingDay })}
            </Typography>
          </td>
        </tr>
        <tr className={classes.totalLeave}>
          <th className="p-1">
            <Typography variant="caption">
              {t("total_leave")} <small>({t("paid")})</small>
            </Typography>
          </th>
          <td className="p-1">
            <Typography variant="subtitle2" component="span">
              {t("day", { count: recapitulation.leave })}
            </Typography>
          </td>
        </tr>
        <tr className={classes.totalAbsent}>
          <th className="p-1">
            <Typography variant="caption">{t("total_absent")}</Typography>
          </th>
          <td className="p-1">
            <Typography variant="subtitle2" component="span">
              {t("day", { count: recapitulation.absent })}
            </Typography>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
