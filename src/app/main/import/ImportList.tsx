import { ImportSuccessDialog } from "./ImportSuccessDialog";
import { FusePageCarded } from "@/@fuse";
import HeaderComponent from "@/app/components/HeaderComponent";
import { MyMaterialTable } from "@/app/components/MyMaterialTable";
import { useStore } from "@/app/store/store";
import { Icon } from "@iconify-icon/react";
import { Button, Chip, useTheme } from "@material-ui/core";
import { Import } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {}

const _ImportList: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const stateImportDialog = useState<Import | null>(null);

  const href = window.location.pathname.split("/");
  const title = t(href[1]);
  const title2 = t(href[2]);

  useEffect(() => {
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;
    void useStore.getState().ImportSlice.actions.fetchImports();
  }, []);

  const imports = useStore((store) => store.ImportSlice.imports);

  return (
    <React.Fragment>
      <FusePageCarded
        header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
        contentToolbar={
          <div className="px-24">
            <h2>{title2}</h2>
          </div>
        }
        content={
          <div className="m-16">
            {/* <AccordionSearch
            onClearSearch={() => {
              throw new Error("TESTING not implemented.");
            }}
            onSearch={() => {}}
          >
            <Grid container spacing={2}></Grid>
          </AccordionSearch> */}

            <Button
              component={Link}
              to="/import/add"
              variant="contained"
              color="primary"
              startIcon={<Icon icon="mdi:plus" />}
              className="mr-8"
            >
              Tambah
            </Button>

            <div className="mt-16" />

            <MyMaterialTable<Import>
              data={imports}
              actions={[
                {
                  icon: () => <Icon icon="mdi:progress-helper" />,
                  tooltip: "View Progress",
                  position: "row",
                  onClick: (event, rowData) => {
                    stateImportDialog[1](rowData as Import);
                  },
                },
              ]}
              options={{
                defaultOrderByCollection: [
                  {
                    orderBy: 0,
                    orderDirection: "DESC",
                    sortOrder: 1,
                  },
                ],
              }}
              columns={[
                {
                  title: "ID",
                  field: "importId",
                },
                {
                  title: t("document_name"),
                  field: "documentName",
                },
                {
                  title: t("type"),
                  field: "type",
                },
                {
                  title: t("status"),
                  field: "status",
                },
                {
                  title: t("success"),
                  field: "successCount",
                  render: (rowData: any) => {
                    return (
                      <span>
                        <Chip
                          label={rowData.successCount}
                          size="small"
                          style={{
                            color: theme.palette.success.contrastText,
                            backgroundColor: theme.palette.success.main,
                          }}
                        />
                        /
                        <Chip
                          label={rowData.processedCount}
                          size="small"
                          style={{
                            color: theme.palette.info.contrastText,
                            backgroundColor: theme.palette.info.light,
                          }}
                        />
                        <br />
                        Total Data: {rowData.dataCount}
                      </span>
                    );
                  },
                },
                {
                  title: t("created_at"),
                  field: "createdAt",
                  render: (rowData) => moment(rowData.createdAt).format("L LTS"),
                },
                {
                  title: t("updated_at"),
                  field: "updatedAt",
                  render: (rowData) => moment(rowData.updatedAt).format("L LTS"),
                },
              ]}
            />
          </div>
        }
      />
      <ImportSuccessDialog stateImportData={stateImportDialog} />
    </React.Fragment>
  );
};

export const ImportList = React.memo(_ImportList);
