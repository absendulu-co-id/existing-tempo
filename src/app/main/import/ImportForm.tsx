import { FusePageCarded, SelectFormsy } from "@/@fuse";
import HeaderComponent from "@/app/components/HeaderComponent";
import { MyMaterialTable } from "@/app/components/MyMaterialTable";
import { ImportService } from "@/app/services/import";
import { useStore } from "@/app/store/store";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Import, ImportAttributes } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Formsy from "formsy-react";
import React, { ChangeEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CreationAttributes } from "sequelize";
import { useImmer } from "use-immer";

interface Props {}

const _ImportForm: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation();
  const param = useParams<{ tableName?: string }>();

  const [form, setForm] = useImmer<Partial<ImportAttributes>>({});
  const [columns, setColumns] = useImmer<Record<string, any>>({});
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = React.useState(false);
  const [importedData, setImportedData] = React.useState<any[]>([]);
  const [importedColumns, setImportedColumns] = React.useState<string[]>([]);
  const [accordionPreview, setAccordionPreview] = React.useState<boolean>(false);

  const href = window.location.pathname.split("/");
  const title = t(href[1]);
  const title2 = t(href[2]);

  const imports = useStore((store) => store.ImportSlice.imports);
  const tables = useStore((store) => store.ImportSlice.tables);

  useEffect(() => {
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;
    void useStore.getState().ImportSlice.actions.fetchImports();
    void useStore.getState().ImportSlice.actions.fetchTables();
  }, []);

  useEffect(() => {
    const table = tables[form.documentName!];

    if (table == null) return;

    const mandotaryColumns = {};
    Object.keys(table).forEach((column) => {
      if (!table[column].allowNull) {
        mandotaryColumns[column] = {};
      }
    });
    setColumns(mandotaryColumns);
  }, [tables, form.documentName]);

  useEffect(() => {
    if (importedColumns.length == 0) return;

    const importedColumnsNotSelected = importedColumns.filter(
      (x) => !Object.keys(columns).includes(x) && Object.keys(tables[form.documentName!]!).includes(x),
    );
    setColumns((draft) => {
      importedColumnsNotSelected.forEach((column) => {
        draft[column] = {};
      });
    });
  }, [importedColumns, form.documentName, columns]);

  useEffect(() => {
    if ("tableName" in param && param.tableName != null) {
      setForm((draft) => {
        draft.documentName = param.tableName?.toCapitalCase();
      });
      void handleTableChanged(param.tableName.toCapitalCase());
    }
  }, [param]);

  const handleInput = async (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (typeof name !== "string" || name == null) {
      throw new Error("Invalid input name");
    }

    setForm((draft) => {
      draft[name] = value;
    });

    if (name == "documentName") {
      await handleTableChanged(value as string);
    }
  };

  const handleTableChanged = async (tableName: string) => {
    await useStore.getState().ImportSlice.actions.fetchTables(tableName);
  };

  const handleColumnCheckboxChanged = (event: React.ChangeEvent<{ name?: string }>, checked: boolean) => {
    if (checked) {
      setColumns((draft) => {
        draft[event.target.name!] = {};
      });
    } else {
      setColumns((draft) => {
        delete draft[event.target.name!];
      });
    }
  };

  const handleFileChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file == null) {
      throw new Error("Selected File not found");
    }
    const resultImport = await ImportService.import({
      file: file[0],
      documentName: form.documentName!,
      columns: tables[form.documentName!]!,
      selectedColumns: columns,
    });

    if (resultImport != null) {
      setImportedColumns(resultImport.columns);
      setImportedData(resultImport.data);
      setSaveButtonEnabled(true);
      setAccordionPreview(true);
    }
  };

  const uploadImportData = async () => {
    const data: CreationAttributes<Import> = {
      data: importedData,
      documentName: form.documentName ?? "",
      type: form.type ?? "INSERT",
      columns: columns,
      status: "DRAFT",
    };
    await useStore.getState().ImportSlice.actions.createImport(data);
    history.back();
  };

  return (
    <FusePageCarded
      header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
      contentToolbar={
        <div className="px-24">
          <h2>{title2}</h2>
        </div>
      }
      content={
        <div className="m-16">
          <Formsy onValid={() => setIsFormValid(true)} onInvalid={() => setIsFormValid(false)}>
            <Grid container spacing={2} className="mb-8">
              <Grid item xs={12} md={6} lg={7}>
                <SelectFormsy
                  name="documentName"
                  value={form.documentName ?? ""}
                  required
                  onChange={handleInput}
                  label="Document Name"
                  variant="outlined"
                >
                  {Object.keys(tables).map((table, i) => (
                    <MenuItem key={i} value={table}>
                      {t(table.toLowerCase())}
                    </MenuItem>
                  ))}
                </SelectFormsy>
              </Grid>
              <Grid item xs={12} md={6} lg={7}>
                <SelectFormsy
                  name="type"
                  value={form.type ?? ""}
                  required
                  onChange={handleInput}
                  label="Type"
                  variant="outlined"
                >
                  <MenuItem value="INSERT">{t("insert")}</MenuItem>
                  <MenuItem value="UPSERT">{t("upsert")}</MenuItem>
                </SelectFormsy>
              </Grid>
            </Grid>

            {form.documentName != null && form.type != null && tables[form.documentName] != null && (
              <React.Fragment>
                <hr />
                <Typography variant="h6" gutterBottom>
                  Import File
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <input
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      style={{ display: "none" }}
                      id="upload-import"
                      type="file"
                      onChange={(e) => handleFileChanged(e)}
                    />
                    <label htmlFor="upload-import">
                      <Button variant="contained" color="primary" component="span">
                        Upload
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion
                      expanded={accordionPreview}
                      onChange={(_, expanded) => setAccordionPreview(expanded)}
                      disabled={!saveButtonEnabled}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Data Preview</AccordionSummary>
                      <AccordionDetails>
                        <MyMaterialTable
                          data={importedData}
                          columns={
                            importedData.length != 0
                              ? Object.keys(importedData[0])
                                  .filter((key) => key !== "id")
                                  .map((key) => ({ title: key, field: key }))
                              : []
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!saveButtonEnabled}
                      onClick={() => uploadImportData()}
                    >
                      Simpan
                    </Button>
                  </Grid>
                </Grid>

                <hr className="my-16" />
                <Button
                  variant="outlined"
                  color="secondary"
                  className="mb-8"
                  onClick={() =>
                    ImportService.generateTemplate({
                      documentName: form.documentName!,
                      columns: tables[form.documentName!]!,
                      selectedColumns: columns,
                    })
                  }
                >
                  Download Template
                </Button>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Kolom {t(form.documentName.toLowerCase())}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <ButtonGroup color="primary" aria-label="outlined primary button group" className="mb-8">
                          <Button
                            onClick={() => {
                              const table = tables[form.documentName!];
                              if (table == null) return;

                              setColumns((draft) => {
                                Object.keys(table).forEach((column) => {
                                  if (draft[column] == null) {
                                    draft[column] = {};
                                  }
                                });
                                return draft;
                              });
                            }}
                          >
                            Pilih Semua
                          </Button>
                          <Button
                            onClick={() => {
                              const table = tables[form.documentName!];
                              if (table == null) return;

                              const mandotaryColumns = {};
                              Object.keys(table).forEach((column) => {
                                if (!table[column].allowNull) {
                                  mandotaryColumns[column] = {};
                                }
                              });

                              setColumns(mandotaryColumns);
                            }}
                          >
                            Hapus Semua Pilihan
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      {Object.keys(tables[form.documentName]!).map((columnName, i) => {
                        const column = tables[form.documentName!]![columnName];

                        return (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <FormControlLabel
                              key={i}
                              checked={columns[columnName] != null}
                              disabled={!column.allowNull}
                              name={columnName}
                              control={<Checkbox />}
                              onChange={handleColumnCheckboxChanged}
                              label={(() => {
                                if (!column.allowNull) {
                                  return (
                                    <>
                                      <b style={{ color: "black" }}>{columnName}*</b>
                                      {column.primaryKey && (
                                        <Chip size="small" label="PK" className="ml-1" color="primary" />
                                      )}

                                      <Chip size="small" label={column.type.name} className="ml-1" color="secondary" />
                                    </>
                                  );
                                }
                                return (
                                  <>
                                    {columnName}
                                    <Chip size="small" label={column.type.name} className="ml-1" color="secondary" />
                                  </>
                                );
                              })()}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </React.Fragment>
            )}
          </Formsy>
        </div>
      }
    />
  );
};

export const ImportForm = React.memo(_ImportForm);
