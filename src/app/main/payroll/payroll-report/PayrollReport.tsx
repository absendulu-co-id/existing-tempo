import { FusePageCarded } from "@fuse";
import { Divider, Grid, List, ListItem, ListItemText, makeStyles, Paper, Theme } from "@material-ui/core";
import { Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import HeaderComponent from "app/components/HeaderComponent";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

enum PayrollReportType {
  SUMMARY,
  TAX,
  EMPLOYEE,
}

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props {
  loading: boolean;
  data: Employee[];
}

const _PayrollReport: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const href = window.location.pathname.split("/");
  const title = t(href[1]);
  document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

  return (
    <FusePageCarded
      header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
      contentToolbar={
        <div className="px-24">
          <h2>Payroll Report</h2>
        </div>
      }
      content={
        <div className="m-8">
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Paper>
                <List className="py-0">
                  <ListItem button component={Link} to="/payroll/report/summary">
                    <ListItemText primary="Ringkasan Gaji" />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem button component={Link} to="/payroll/report/by-department">
                    <ListItemText primary="Ringkasan Gaji per Departmen" />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem button component={Link} to="/payroll/report/by-component">
                    <ListItemText primary="Ringkasan Gaji per Komponen Gaji" />
                  </ListItem>
                  {/* <Divider component="li" />
                <ListItem button component={Link} to="/payroll/report/tax">
                  <ListItemText primary="e-SPT PPH 21/26"/>
                </ListItem>
                <Divider component="li" />
                <ListItem button component={Link} to="/payroll/report/bpjs">
                  <ListItemText primary="BPJS"/>
                </ListItem> */}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      }
    />
  );
};

export const PayrollReport = React.memo(_PayrollReport);
