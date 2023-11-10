import { PayrollAccordion, PayrollAccordionDetails, PayrollAccordionSummary } from "../../components/Accordion";
import { PayrollService } from "@/app/services/payroll";
import { Icon } from "@iconify-icon/react";
import { AccordionProps, Tooltip, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MyFormattedNumber } from "app/components/MyFormattedNumber";
import { MyMaterialTable, MyMaterialTableProps } from "app/components/MyMaterialTable";
import { PayrollAmountType, PayrollComponent, PayrollComponentType } from "interface";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import sweetalert2 from "sweetalert2/dist/sweetalert2.js";

interface Props extends Omit<AccordionProps, "children"> {
  payrollComponents: PayrollComponent[];
  componentType: PayrollComponentType;
  onDelete: (selectedData: PayrollComponent[]) => void;
  tableProps?: Partial<MyMaterialTableProps<PayrollComponent>>;
}

export const PayrollComponentTable: React.FC<Props> = ({
  payrollComponents,
  componentType,
  onDelete,
  tableProps,
  ...props
}) => {
  const filteredPayrollComponents = payrollComponents.filter((x) => x.type == componentType);
  const { t } = useTranslation();

  return (
    <PayrollAccordion
      defaultExpanded
      {...props}
      style={{
        backgroundColor: `${PayrollService.backgroundColor(componentType)}99`,
        ...props.style,
      }}
    >
      <PayrollAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t(componentType.toLowerCase())}</Typography>
      </PayrollAccordionSummary>
      {componentType == PayrollComponentType.BENEFIT && (
        <Typography component="div" variant="caption" className="text-gray-600">
          {t("benefit_tooltip")}
        </Typography>
      )}
      <PayrollAccordionDetails>
        <MyMaterialTable<PayrollComponent>
          options={{
            selection: true,
          }}
          data={filteredPayrollComponents}
          actions={[
            {
              icon: () => <Icon icon="mdi:pencil" />,
              tooltip: "Edit",
              actionRouter: true,
              to: (location, data) => `/payroll/component/update/${data.payrollComponentId}`,
              position: "row",
            },
            {
              icon: () => <Icon icon="mdi:delete" style={{ color: "red" }} />,
              onClick: async (e, selectedData) => {
                const swalResult = await sweetalert2.fire({
                  title: "Yakin untuk menghapus data ini?",
                  text: "Data yang terhapus tidak dapat dikembalikan lagi!",
                  icon: "warning",
                  showCancelButton: true,
                  cancelButtonText: "Batal",
                  confirmButtonText: "OK",
                });

                if (swalResult.isConfirmed) {
                  if (!Array.isArray(selectedData)) {
                    selectedData = [selectedData];
                  }
                  onDelete(selectedData);
                }
              },
            },
          ]}
          columns={[
            {
              field: "name",
              title: t("name"),
            },
            {
              field: "amount",
              title: t("amount"),
              render: (rowData) => {
                if (rowData.amountType == PayrollAmountType.EXACT) {
                  return <MyFormattedNumber value={rowData.amount} />;
                } else {
                  return <MyFormattedNumber value={rowData.amount / 100} style="percent" />;
                }
              },
            },
            {
              field: "amountType",
              title: t("amount_type"),
              render: (rowData) => t(rowData.amountType.toLowerCase()),
            },
            {
              field: "amountCalculation",
              title: t("amount_calculation"),
              render: (rowData) => t(rowData.amountCalculation.toLowerCase()),
            },
            {
              field: "notes",
              title: t("internal_notes"),
            },
            {
              field: "createdAt",
              title: t("created_at"),
              render: (rowData) => (
                <Tooltip title={moment(rowData.createdAt).format("LLLL")}>
                  <span>{moment(rowData.createdAt).fromNow()}</span>
                </Tooltip>
              ),
            },
            {
              field: "updatedAt",
              title: t("updated_at"),
              render: (rowData) => (
                <Tooltip title={moment(rowData.updatedAt).format("LLLL")}>
                  <span>{moment(rowData.updatedAt).fromNow()}</span>
                </Tooltip>
              ),
              hidden: true,
            },
          ]}
          {...tableProps}
        />
      </PayrollAccordionDetails>
    </PayrollAccordion>
  );
};
