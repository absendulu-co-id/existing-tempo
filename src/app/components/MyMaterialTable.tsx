/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { MyMTableAction } from "./MyMTableAction";
import MaterialTable, { CellStyle, Column, MaterialTableProps, MTableToolbar, Options } from "@material-table/core";
import { FormControl, InputLabel, MenuItem, Paper, Select, Toolbar } from "@material-ui/core";
import { nanoid } from "@reduxjs/toolkit";
import { MaterialTableExportService } from "app/services/material-table-export.service";
import { RootState } from "app/store";
import { id } from "date-fns/locale";
import { GeneralConfigField, MyMaterialTableAction } from "interface";
import moment from "moment";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/id_ID";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export type MyColumn<RowData extends object> = Column<RowData> &
  Partial<GeneralConfigField> & {
    name?: string;
    label?: string;
  };

export interface MyOptions<RowData extends object> extends Options<RowData> {
  showExport?: boolean;
  exportFileName?: string;
}

export type MyMaterialTableActions<RowData extends object> = (
  | MyMaterialTableAction<RowData>
  | ((rowData: RowData) => MyMaterialTableAction<RowData>)
  | {
      action: (rowData: RowData) => MyMaterialTableAction<RowData>;
    }
)[];

export interface MyMaterialTableProps<RowData extends object>
  extends Omit<MaterialTableProps<RowData>, "columns" | "actions"> {
  urlParams?: string;
  // onRowSort: (orderBy: string, sortDirection: "asc" | "desc") => void
  columns: MyColumn<RowData>[];
  initOrderBy?: string;
  initSortDirection?: "asc" | "desc";
  actions?: MyMaterialTableActions<RowData>;
  options?: MyOptions<RowData>;
  pageSize?: number;
  onPageChangeCustom?: (page: number | null, pageSize: number | null) => Promise<void>;
}

const defaultCellStyle: CellStyle<any> = {
  borderRight: "1px solid #eee",
  padding: "4px 8px",
};

export const MyMaterialTable = <RowData extends object = any>(props: MyMaterialTableProps<RowData>) => {
  const { t } = useTranslation();
  const [perPage, setPerPage] = useState(10);
  const [historyOrderBy, setHistoryOrderBy] = useState<string>();
  const [orderBy, setOrderBy] = useState<string>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let queryPage: number | undefined;
  let paginationInit = false;
  let data = props.data;

  const handlePerPageChange = async (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value;

    // history.push(`?perpage=${value}` + encodeURI(props.urlParams ?? ""));
    setPerPage(value);
    if (props.onRowsPerPageChange) props.onRowsPerPageChange(value);
    if (props.onPageChangeCustom) await props.onPageChangeCustom(null, value);
  };

  const onRowSort = (column: Column<RowData>) => {
    const columnName = column.field?.toString() ?? "";

    if (columnName == orderBy) {
      if (sortDirection == "asc") setSortDirection("desc");
      else if (sortDirection == "desc") setSortDirection("asc");
    } else {
      setOrderBy(columnName);
      // setSortDirection("asc");
    }

    // props.onRowSort(columnName, sortDirection ?? "asc");
  };

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const page = parseInt(params.get("page") ?? "");

    if (!isNaN(page)) {
      queryPage = page;
    }
    // console.log(props.initOrderBy, historyOrderBy);
    // if (props.initOrderBy != historyOrderBy) {
    //   setOrderBy(props.initOrderBy);
    //   setHistoryOrderBy(props.initOrderBy);
    //   if (props.initSortDirection != null) {
    //     setSortDirection(props.initSortDirection);
    //   }
    // }

    if (Array.isArray(props.data)) {
      data = props.data.map((x) => {
        if ((x as any).id == null && Object.isExtensible(x)) {
          (x as any).id = nanoid();
        }
        return x;
      });
    }
  });

  const access = useSelector((state: RootState) => state.globalReducer.pageRule);

  const columns =
    props.columns == null
      ? []
      : props.columns.map((x) => {
          if ("actionsCellStyle" in x) {
            if (x.actionsCellStyle != null) {
              x.actionsCellStyle = {
                ...defaultCellStyle,
                ...x.actionsCellStyle,
              };
            }
          }
          if (x.headerStyle != null && typeof x.headerStyle !== "function") {
            x.headerStyle = {
              backgroundColor: "#0101",
              ...x.headerStyle,
            };
          }

          if (x.cellStyle != null && typeof x.cellStyle !== "function") {
            x.cellStyle = {
              ...defaultCellStyle,
              ...x.cellStyle,
            };
          }

          if ("editCellStyle" in x) {
            if (x.editCellStyle != null && typeof x.editCellStyle !== "function") {
              x.editCellStyle = {
                ...defaultCellStyle,
                ...x.editCellStyle,
              };
            }
          }

          return x;
        });

  return (
    <MaterialTable
      isLoading={isLoading}
      {...(props as any)}
      // onOrderCollectionChange={(orderByCollection) => {
      //   console.log(orderByCollection);
      // }}
      data={data ?? props.data}
      options={
        {
          padding: "dense",
          filtering: false,
          paging: true,
          search: false,
          selection: false,
          pageSize: perPage,
          // tableLayout: "fixed",
          pageSizeOptions: [5, 10, 25, 50, 100],
          exportAllData: true,
          exportAll: true,
          ...props.options,

          actionsCellStyle: {
            borderRight: "1px solid #eee",
            padding: "4px 8px",
            ...props.options?.actionsCellStyle,
          },
          headerStyle: {
            backgroundColor: "#0101",
            ...props.options?.headerStyle,
          },
          cellStyle: {
            borderRight: "1px solid #eee",
            padding: "4px 8px",
            ...(props.options as any)?.cellStyle,
          },
          editCellStyle: {
            borderRight: "1px solid #eee",
            padding: "4px 8px",
            ...props.options?.editCellStyle,
          },
          ...(props.options?.showExport
            ? {
                exportMenu: [
                  {
                    label: "Export PDF",
                    exportFunc: async (cols, datas) =>
                      await MaterialTableExportService.pdf(
                        cols,
                        datas,
                        props.options?.exportFileName ?? moment().format("L LTS"),
                      ),
                  },
                  {
                    label: "Export XLSX",
                    exportFunc: async (cols, datas) =>
                      await MaterialTableExportService.xlsx(
                        cols,
                        datas,
                        props.options?.exportFileName ?? moment().format("L LTS"),
                      ),
                  },
                  {
                    label: "Export CSV",
                    exportFunc: async (cols, datas) =>
                      await MaterialTableExportService.export(
                        cols,
                        datas,
                        props.options?.exportFileName ?? moment().format("L LTS"),
                        "csv",
                      ),
                  },
                  {
                    label: "Export JSON",
                    exportFunc: async (cols, datas) =>
                      await MaterialTableExportService.export(
                        cols,
                        datas,
                        props.options?.exportFileName ?? moment().format("L LTS"),
                        "json",
                      ),
                  },
                  {
                    label: "Export HTML",
                    exportFunc: async (cols, datas) =>
                      await MaterialTableExportService.export(
                        cols,
                        datas,
                        props.options?.exportFileName ?? moment().format("L LTS"),
                        "html",
                      ),
                  },
                  {
                    label: "Export XML",
                    exportFunc: async (cols, datas) =>
                      await MaterialTableExportService.export(
                        cols,
                        datas,
                        props.options?.exportFileName ?? moment().format("L LTS"),
                        "xml",
                      ),
                  },
                ] as {
                  label: string;
                  exportFunc: (
                    columns: MyColumn<RowData>[],
                    renderData: RowData[],
                    tableData: {
                      searchedData: RowData[];
                      filteredData: RowData[];
                      groupedData: RowData[];
                    },
                  ) => void;
                }[],
              }
            : {}),
        } as Options<RowData> & { cellStyle: React.CSSProperties }
      }
      components={{
        // Header: () => (
        //   <TableHead style={{ backgroundColor: "#0101" }}>
        //     <TableRow>
        //       {access.deleteRule
        //         ? <TableCell width="1%" style={{ padding: "0px" }}></TableCell>
        //         : null}
        //       {props.columns.map((headCell, i) =>
        //         <TableCell style={{
        //           borderRight: "1px solid #eee",
        //           padding: "8px 8px",
        //           fontWeight: "bold",
        //         }}
        //         key={i}
        //         sortDirection={orderBy == headCell.field
        //           ? sortDirection ?? props.initSortDirection
        //           : false}
        //         align={headCell.type === "numeric" ? "right" : "left"}
        //         >
        //           {headCell.sorting === false
        //             ? headCell.label
        //             : <TableSortLabel
        //               active={orderBy === headCell.field}
        //               direction={orderBy == headCell.field
        //                 ? sortDirection
        //                 : undefined
        //               }
        //               onClick={() => onRowSort(headCell)}
        //             >
        //               {headCell.title}
        //             </TableSortLabel>
        //           }
        //         </TableCell>)}
        //     </TableRow>
        //   </TableHead>
        // ),
        // Header: (headerProps) => {
        //   console.log(headerProps);
        //   return <MTableHeader {...headerProps} onOrderChange={(a, b, c) => console.log(a, b, c)} />;
        // },
        Container: (propsContainer) => <Paper elevation={2} {...propsContainer} className="w-full" />,
        Pagination: (propsPagination) => {
          const propsCurrentPage = propsPagination.page + 1;
          if (props.data != undefined && queryPage != undefined && !paginationInit) {
            propsPagination.onPageChange(null, queryPage - 1);
            paginationInit = true;
            return null;
          }

          return (
            <td>
              <Toolbar>
                <FormControl className="ml-2 mr-8">
                  <InputLabel>Baris</InputLabel>
                  <Select
                    value={propsPagination.rowsPerPage}
                    onChange={(e) => handlePerPageChange(e)}
                    label="Baris"
                    disableUnderline
                  >
                    {propsPagination.rowsPerPageOptions.map((rowsPerPage) => (
                      <MenuItem key={rowsPerPage} value={rowsPerPage}>
                        {rowsPerPage}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Pagination
                  showTotal={(total, range) => `${range[0]} - ${range[1]} dari ${total} baris`}
                  className="mx-12"
                  onChange={async (page, pageSize) => {
                    // history.push(`?page=${page}` + encodeURI(props.urlParams ?? ""));
                    propsPagination.onPageChange(null, page - 1);
                    if (props.onPageChangeCustom != null) {
                      setIsLoading(true);
                      await props.onPageChangeCustom(page, pageSize);
                      setIsLoading(false);
                    }
                  }}
                  pageSize={props.pageSize ?? propsPagination.rowsPerPage}
                  current={props.page ?? propsCurrentPage}
                  total={props.totalCount ?? propsPagination.count}
                  locale={localeInfo}
                  showSizeChanger={true}
                />
              </Toolbar>
            </td>
          );
        },
        Toolbar: (propsToolbar) => {
          if (
            (propsToolbar?.title != "Table Title" && propsToolbar.table != "") ||
            propsToolbar.dataManager.selectedCount > 0 ||
            props.options?.columnsButton == true ||
            props.options?.showExport == true
          ) {
            return (
              <MTableToolbar
                {...{
                  ...propsToolbar,
                  ...(propsToolbar?.title == "Table Title" ? { title: "" } : {}),
                }}
              />
            );
          }
          return <React.Fragment />;
        },
        Action: (propsAction) => <MyMTableAction {...propsAction} />,
        ...props.components,
      }}
      localization={{
        error: "Data tidak dapat diambil",
        grouping: {
          groupedBy: "Dikelompokkan Menurut:",
          placeholder: "Seret tajuk ke sini untuk dikelompokkan menurut",
        },
        pagination: {
          labelDisplayedRows: "{from}-{to} dari {count}",
          labelRowsPerPage: "Baris per halaman:",
          // labelRows: "rows",
          firstAriaLabel: "Halaman Pertama",
          firstTooltip: "Halaman Pertama",
          previousAriaLabel: "Halaman Sebelumnya",
          previousTooltip: "Halaman Sebelumnya",
          nextAriaLabel: "Halaman Berikutnya",
          nextTooltip: "Halaman Berikutnya",
          lastAriaLabel: "Halaman Terakhir",
          lastTooltip: "Halaman Terakhir",
        },
        toolbar: {
          addRemoveColumns: "Tambah atau hapus kolom",
          nRowsSelected: "{0} baris dipilih",
          showColumnsTitle: "Tampilkan Kolom",
          showColumnsAriaLabel: "Tampilkan Kolom",
          exportTitle: "Ekspor",
          exportAriaLabel: "Ekspor",
          searchTooltip: "Pencarian",
          searchPlaceholder: "Pencarian",
          searchAriaLabel: "Pencarian",
          clearSearchAriaLabel: "Hapus Pencarian",
        },
        header: { actions: t("action") },
        body: {
          emptyDataSourceMessage: "Tidak ada data ditampilkan",
          editRow: {
            saveTooltip: "Simpan",
            cancelTooltip: "Batal",
            deleteText: "Anda yakin ingin menghapus baris ini?",
          },
          filterRow: {},
          dateTimePickerLocalization: id,
          addTooltip: "Tambah",
          deleteTooltip: "Hapus",
          editTooltip: "Ubah",
          bulkEditTooltip: "Ubah Semua",
          bulkEditApprove: "Simpan semua perubahan",
          bulkEditCancel: "Buang semua perubahan",
        } as any,
      }}
    />
  );
};
