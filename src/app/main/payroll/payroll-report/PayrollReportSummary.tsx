import { PayrollService } from "@/app/services/payroll";
import { FusePageCarded } from "@fuse";
import { Icon } from "@iconify-icon/react";
import { LinearProgress, makeStyles, Theme, Tooltip, Typography, useTheme } from "@material-ui/core";
import { green, red, yellow } from "@material-ui/core/colors";
import HeaderComponent from "app/components/HeaderComponent";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import { MyMaterialTable } from "app/components/MyMaterialTable";
import Axios from "axios";
import { PayrollComponentType } from "interface";
import {
  _PayrollReportByDepartmentTransposed,
  PayrollReportByDepartment,
  PayrollReportSummary as ReportSummary,
} from "interface/models/report/payroll-report";
import moment from "moment";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props {
  test: any;
}

export const PayrollReportSummary: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const [loading, setLoading] = React.useState(true);
  const [reportSummary, setReportSummary] = React.useState<ReportSummary[]>([]);
  const [reportByDepartment, setReportByDepartment] = React.useState<Record<string, PayrollReportByDepartment>>({});

  const href = window.location.pathname.split("/");
  const title = t(href[1]);
  document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

  useEffect(() => {
    void getData();
  }, []);

  const getData = async (payrollId?: number) => {
    const res = await Axios.get<ReportSummary | ReportSummary[]>(
      "v1/payroll-report/summary" + (payrollId != null ? `/${payrollId}` : ""),
    );
    let resData: ReportSummary[];

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
      setReportSummary(resData);
    }

    setLoading(false);
  };

  const getReportByDepartment = async (payrollId?: number) => {
    const res = await Axios.get<PayrollReportByDepartment | PayrollReportByDepartment[]>(
      "v1/payroll-report/by-department" + (payrollId != null ? `/${payrollId}` : ""),
    );

    if (res.data != null) {
      if (Array.isArray(res.data)) {
        setReportByDepartment((prev) => {
          const obj = {};
          (res.data as PayrollReportByDepartment[]).forEach((report) => {
            obj[report.payrollId!] = report;
          });

          return obj;
        });
      }
      if (payrollId != null) {
        setReportByDepartment((prev) => {
          return {
            ...prev,
            ...{
              [payrollId]: res.data,
            },
          };
        });
      }
    }
  };

  return (
    <FusePageCarded
      header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
      contentToolbar={
        <div className="px-24">
          <h2>{t("payroll_report_summary")}</h2>
        </div>
      }
      content={
        <div className="m-8">
          <MyMaterialTable<ReportSummary>
            data={reportSummary}
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
              exportFileName: `${t("payroll_report_summary")}`,
            }}
            actions={[
              {
                icon: () => <Icon icon="solar:money-bag-bold" />,
                actionRouter: true,
                to: (location, row) => `/payroll/master/${row.payrollId}`,
                tooltip: t("view_detail").toString(),
              },
            ]}
            detailPanel={({ rowData }) => {
              if (reportByDepartment[rowData.payrollId!] == null) {
                void getReportByDepartment(rowData.payrollId!);
                return <LinearProgress className="m-8" />;
              } else {
                const transposedData: _PayrollReportByDepartmentTransposed[] = [];
                Object.keys(reportByDepartment[rowData.payrollId!].reports).forEach((key) => {
                  const data = reportByDepartment[rowData.payrollId!].reports[key];
                  transposedData.push({
                    ...data,
                    department: key,
                  });
                });
                return (
                  <div
                    style={{
                      marginLeft: "30%",
                      marginTop: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <MyMaterialTable
                      data={transposedData}
                      options={{
                        paging: false,
                        defaultOrderByCollection: [
                          {
                            orderBy: 4,
                            orderDirection: "desc",
                            sortOrder: 1,
                          },
                        ],
                      }}
                      columns={[
                        {
                          title: t("department"),
                          field: "department",
                        },
                        {
                          title: t("salary"),
                          field: "salary",
                          render: (rowData) => <MyFormattedNumber value={rowData.salary} />,
                          headerStyle: {
                            backgroundColor: PayrollService.backgroundColor(PayrollComponentType.EARNING),
                          },
                          cellStyle: {
                            backgroundColor: green.A100,
                          },
                        },
                        {
                          title: t("allowance"),
                          field: "allowance",
                          render: (rowData) => <MyFormattedNumber value={rowData.allowance} />,
                          headerStyle: {
                            backgroundColor: PayrollService.backgroundColor(PayrollComponentType.EARNING),
                          },
                          cellStyle: {
                            backgroundColor: green.A100,
                          },
                        },
                        {
                          title: t("deduction"),
                          field: "deduction",
                          render: (rowData) => <MyFormattedNumber value={rowData.deduction} />,
                          headerStyle: {
                            backgroundColor: PayrollService.backgroundColor(PayrollComponentType.DEDUCTION),
                          },
                          cellStyle: {
                            backgroundColor: red.A100,
                          },
                        },
                        {
                          title: t("take_home_pay"),
                          field: "takeHomePay",
                          render: (rowData) => <MyFormattedNumber value={rowData.takeHomePay} />,
                          headerStyle: {
                            backgroundColor: theme.palette.primary.main,
                          },
                          cellStyle: {
                            backgroundColor: theme.palette.primary.light,
                          },
                        },
                        {
                          title: t("benefit") + "*",
                          field: "benefit",
                          render: (rowData) => <MyFormattedNumber value={rowData.benefit} />,
                          headerStyle: {
                            backgroundColor: PayrollService.backgroundColor(PayrollComponentType.BENEFIT),
                          },
                          cellStyle: {
                            backgroundColor: yellow[100],
                          },
                        },
                      ]}
                    />
                  </div>
                );
              }
            }}
            columns={[
              {
                title: t("period"),
                field: "period",
              },
              {
                title: t("cutoff"),
                field: "cutoffStart",
                render: (rowData) =>
                  moment(rowData.cutoffStart).format("ll") + " - " + moment(rowData.cutoffEnd).format("ll"),
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
              {
                title: t("salary"),
                field: "report.salary",
                render: (rowData) => <MyFormattedNumber value={rowData.report.salary} />,
                headerStyle: {
                  backgroundColor: PayrollService.backgroundColor(PayrollComponentType.EARNING),
                },
                cellStyle: {
                  backgroundColor: green.A100,
                },
              },
              {
                title: t("allowance"),
                field: "report.allowance",
                render: (rowData) => <MyFormattedNumber value={rowData.report.allowance} />,
                headerStyle: {
                  backgroundColor: PayrollService.backgroundColor(PayrollComponentType.EARNING),
                },
                cellStyle: {
                  backgroundColor: green.A100,
                },
              },
              {
                title: t("deduction"),
                field: "report.deduction",
                render: (rowData) => <MyFormattedNumber value={rowData.report.deduction} />,
                headerStyle: {
                  backgroundColor: PayrollService.backgroundColor(PayrollComponentType.DEDUCTION),
                },
                cellStyle: {
                  backgroundColor: red.A100,
                },
              },
              {
                title: t("take_home_pay"),
                field: "report.takeHomePay",
                render: (rowData) => <MyFormattedNumber value={rowData.report.takeHomePay} />,
                headerStyle: {
                  backgroundColor: theme.palette.primary.main,
                },
                cellStyle: {
                  backgroundColor: theme.palette.primary.light,
                },
              },
              {
                title: t("benefit") + "*",
                field: "report.benefit",
                render: (rowData) => <MyFormattedNumber value={rowData.report.benefit} />,
                headerStyle: {
                  backgroundColor: PayrollService.backgroundColor(PayrollComponentType.BENEFIT),
                },
                cellStyle: {
                  backgroundColor: yellow[100],
                },
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
