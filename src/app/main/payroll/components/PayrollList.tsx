import { Store, useStore } from "@/app/store/store";
import { Tooltip, useTheme } from "@material-ui/core";
import { MyColumn, MyMaterialTable, MyMaterialTableActions, MyOptions } from "app/components/MyMaterialTable";
import { Payroll } from "interface";
import moment from "moment";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  tableActions?: MyMaterialTableActions<Payroll>;
  firstColumn?: MyColumn<Payroll>[];
  showFinal?: boolean | undefined;
  options?: MyOptions<Payroll>;
}

const _PayrollList: React.FC<Props> = ({ showFinal, tableActions, firstColumn, options, ...props }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const loading = useStore((store: Store) => store.PayrollSlice.loading);
  const payrolls = useStore((store: Store) => store.PayrollSlice.payrolls);
  const fetchPayrolls = useStore((store: Store) => store.PayrollSlice.actions.fetchPayrolls);

  useEffect(() => {
    void fetchPayrolls();
  }, []);

  return (
    <MyMaterialTable
      data={payrolls}
      actions={tableActions}
      isLoading={loading}
      options={{
        columnsButton: true,
        thirdSortClick: false,
        defaultOrderByCollection: [{ orderBy: 9, orderDirection: "desc", sortOrder: 1 }],
        showExport: true,
        ...options,
      }}
      columns={[
        ...(firstColumn != null ? firstColumn : []),
        {
          title: t("final"),
          field: "isFinal",
          lookup: {
            false: t("no"),
            true: t("yes"),
          },
          cellStyle: (data, rowData) => {
            if (typeof rowData.isFinal == "string") {
              if (rowData.isFinal == "Tidak") {
                return {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                };
              }
            }

            if (rowData.isFinal) {
              return {
                backgroundColor: theme.palette.primary.light,
              };
            } else {
              return {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
              };
            }
          },
          hidden: showFinal != null,
        },
        {
          title: t("employee_count"),
          field: "payslipCount",
        },
        {
          title: t("company_name"),
          field: "companyName",
        },
        {
          title: t("company_address"),
          field: "companyAddress",
          hidden: true,
        },
        {
          title: t("company_phone"),
          field: "companyPhone",
          hidden: true,
        },
        {
          title: t("period"),
          field: "period",
          render: (rowData) => rowData.period,
        },
        {
          title: t("cutoff"),
          field: "cutoffStart",
          render: (rowData: Payroll) =>
            `${moment(rowData.cutoffStart).format("ll")} - ${moment(rowData.cutoffEnd).format("ll")}`,
        },
        {
          title: t("creator_name"),
          field: "creatorName",
          exportTransformer: (rowData) => rowData.creatorName ?? "",
        },
        {
          title: t("creator_position"),
          field: "creatorPosition",
          hidden: true,
          exportTransformer: (rowData) => rowData.creatorPosition ?? "",
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
          title: t("updated_at"),
          field: "updatedAt",
          render: (rowData) => (
            <Tooltip title={moment(rowData.updatedAt).format("ll LTS")}>
              <span>{moment(rowData.updatedAt).fromNow()}</span>
            </Tooltip>
          ),
          exportTransformer: (rowData) => moment(rowData.createdAt).format("L LTS"),
          hidden: true,
        },
      ]}
    />
  );
};

export const PayrollList = React.memo(_PayrollList);
