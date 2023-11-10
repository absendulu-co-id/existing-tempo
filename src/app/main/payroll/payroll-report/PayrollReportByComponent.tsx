import { PayrollService } from "@/app/services/payroll";
import { FusePageCarded } from "@fuse";
import { Icon } from "@iconify-icon/react";
import { makeStyles, Theme, Tooltip, Typography, useTheme } from "@material-ui/core";
import { green, red, yellow } from "@material-ui/core/colors";
import HeaderComponent from "app/components/HeaderComponent";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import { MyColumn, MyMaterialTable } from "app/components/MyMaterialTable";
import Axios from "axios";
import { PayrollComponentType, PayrollReportByComponent as ReportByComponent } from "interface";
import moment from "moment";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props {
  test: any;
}

export const PayrollReportByComponent: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const [loading, setLoading] = React.useState(true);
  const [report, setReport] = React.useState<ReportByComponent[]>([]);
  const [columns, setColumns] = React.useState<MyColumn<ReportByComponent>[]>([
    {
      title: t("period"),
      field: "period",
    },
    {
      title: t("cutoff"),
      field: "cutoffStart",
      render: (rowData) => moment(rowData.cutoffStart).format("ll") + " - " + moment(rowData.cutoffEnd).format("ll"),
    },
    {
      title: t("employee_count"),
      field: "payslipCount",
    },
    {
      title: t("created_at"),
      field: "createdAt",
      render: (rowData) => (
        <Tooltip title={moment(rowData.createdAt).format("ll LTS")}>
          <span>{moment(rowData.createdAt).fromNow()}</span>
        </Tooltip>
      ),
      exportTransformer: (rowData) => moment(rowData.createdAt).format("L LTS"),
    },
  ]);

  const href = window.location.pathname.split("/");
  const title = t(href[1]);
  document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

  useEffect(() => {
    void getData();
  }, []);

  const getData = async (payrollId?: number) => {
    const res = await Axios.get<ReportByComponent | ReportByComponent[]>(
      "v1/payroll-report/by-component" + (payrollId != null ? `/${payrollId}` : ""),
    );
    let resData: ReportByComponent[];

    if (res.data != null) {
      if (Array.isArray(res.data)) {
        resData = res.data;
      } else {
        resData = [res.data];
      }
      resData = resData.map((x) => {
        if ((x as any).id == null) {
          (x as any).id = x.payrollId;
        }
        return x;
      });
      setReport(resData);

      const newColumns: MyColumn<ReportByComponent>[] = [];

      Object.keys(resData[0].reports)
        .sort((a, b) => {
          if (b == "EARNING") {
            return 1;
          }
          return -1;
        })
        .forEach((key) => {
          Object.keys(resData[0].reports[key]).forEach((key2) => {
            if (!newColumns.find((x) => x.name == key2)) {
              let color: string = "";

              switch (PayrollComponentType[key]) {
                case PayrollComponentType.EARNING:
                  color = green.A100;
                  break;
                case PayrollComponentType.DEDUCTION:
                  color = red.A100;
                  break;
                case PayrollComponentType.BENEFIT:
                  color = yellow[100];
                  break;
              }
              newColumns.push({
                title: `${key2}${PayrollComponentType[key] == PayrollComponentType.BENEFIT ? "*" : ""}`,
                field: `reports.${key}.${key2}`,
                render: (rowData) => <MyFormattedNumber value={rowData.reports[key][key2]} />,
                headerStyle: {
                  backgroundColor: PayrollService.backgroundColor(PayrollComponentType[key]),
                },
                cellStyle: {
                  backgroundColor: color,
                },
              });
            }
          });
        });

      setColumns((prev) => prev.concat(newColumns));
    }

    setLoading(false);
  };

  return (
    <FusePageCarded
      header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
      contentToolbar={
        <div className="px-24">
          <h2>{t("payroll_report_by_component")}</h2>
        </div>
      }
      content={
        <div className="m-8">
          <MyMaterialTable<ReportByComponent>
            data={report}
            isLoading={loading}
            options={{
              defaultOrderByCollection: [
                {
                  orderBy: 3,
                  orderDirection: "desc",
                  sortOrder: 1,
                },
              ],
              columnsButton: true,
              showExport: true,
              exportFileName: `${t("payroll_report_by_component")}`,
            }}
            columns={columns}
            actions={[
              {
                icon: () => <Icon icon="solar:money-bag-bold" />,
                actionRouter: true,
                to: (location, row) => `/payroll/master/${row.payrollId}`,
                tooltip: t("view_detail").toString(),
              },
            ]}
          />
          <Typography variant="subtitle2" component="p" className="m-8">
            *{t("benefit_tooltip")}
          </Typography>
        </div>
      }
    />
  );
};
