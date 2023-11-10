import * as AuthActions from "@/app/auth/store/actions";
import * as Actions from "@/app/store/actions";
import { RootState } from "@/app/store";
import { createData, updateData } from "@/app/store/actions/globalAction";
import { reactTableCustomStyles } from "@/app/styles/materialTableTheme";
import { RootObjectRows } from "@/interface";
import { Grid, Icon, IconButton, InputAdornment, Paper, TextField } from "@material-ui/core";
import { Employee } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface ParentState {
  selectedEmployees: Employee[];
}

interface Props extends PropsFromRedux {
  selectedEmployees: Employee[];
  setParentState<K extends keyof ParentState>(
    state:
      | ((prevState: Readonly<ParentState>, props: Readonly<any>) => Pick<ParentState, K> | null)
      | (Pick<ParentState, K> | null),
    callback?: () => void,
  ): void;
}

const _ReportEmployeeTableSelection: React.FC<Props> = ({ user, setParentState, ...props }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesCount, setEmployeesCount] = useState<number>(0);
  const selectedEmployees = props.selectedEmployees as Readonly<typeof props.selectedEmployees>;

  const setSelectedEmployees = (newSelectedEmployees: SetStateAction<Employee[]>) => {
    if (typeof newSelectedEmployees === "function") {
      setParentState((prevState) => {
        return {
          selectedEmployees: newSelectedEmployees(prevState.selectedEmployees),
        };
      });
    } else {
      setParentState({ selectedEmployees: newSelectedEmployees });
    }
  };

  const [page, setPage] = useState<number>(1);
  const [tablePerPage, setTablePerPage] = useState<number>(10);
  const [order, setOrder] = useState<string>("");
  const [resetPagination, setResetPagination] = useState<boolean>(false);

  const [filterEmployeeName, setFilterEmployeeName] = useState<string>("");
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("");

  const [filterSelectedEmployeeName, setFilterSelectedEmployeeName] = useState<string>("");
  const [filterSelectedEmployeeId, setFilterSelectedEmployeeId] = useState<string>("");

  const [isSearch, setIsSearch] = useState<boolean>(false);

  const sameColumnTableEmployee: TableColumn<Employee>[] = [
    {
      name: "NIK",
      selector: (row) => row.employeeId,
      sortable: true,
      sortfield: "employeeId",
    },
    {
      name: "Employee",
      selector: (row) => row.employeeName,
      sortable: true,
      sortfield: "employeeName",
    },
    {
      name: "Department",
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      selector: (row) => row.department?.departmentName ?? row.departmentName ?? "",
      sortable: false,
    },
  ];

  const fetchEmployees = async (newPage?: number) => {
    setLoading(true);

    const response = await Axios.get<RootObjectRows<Employee>>(`/Employees`, {
      params: {
        "filter[include]": "department",
        "filter[limit]": tablePerPage,
        "filter[skip]": (newPage ?? page) * tablePerPage - tablePerPage,
        ...(filterEmployeeName != ""
          ? {
              "filter[where][employeeName][like]": filterEmployeeName,
            }
          : {}),
        ...(filterEmployeeId != ""
          ? {
              "filter[where][employeeId][like]": filterEmployeeId,
            }
          : {}),
        ...(user.data.userType !== "mid-admin"
          ? {
              "filter[where][organizationId]": user.data.defaultOrganizationAccess.organizationId,
            }
          : {}),
        ...(order
          ? {
              "filter[order]": order,
            }
          : {}),
      },
    });

    setLoading(false);
    setEmployees(response.data.rows ?? []);
    setEmployeesCount(response.data.count ?? 0);
    if (newPage != null) setPage(newPage);
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  useEffect(() => {
    if (isSearch && (filterEmployeeId != "" || filterEmployeeName != "")) {
      void fetchEmployees();
    }

    if (!isSearch && filterEmployeeId == "" && filterEmployeeName == "") {
      void fetchEmployees();
    }
  }, [filterEmployeeId, filterEmployeeName, isSearch]);

  const filteredSelectedEmployees = selectedEmployees.filter((x) => {
    const a = x.employeeId.toLowerCase().includes(filterSelectedEmployeeId.toLowerCase());
    const b = x.employeeName?.toLowerCase().includes(filterSelectedEmployeeName.toLowerCase());
    if (filterSelectedEmployeeId == "" && filterSelectedEmployeeName != "") {
      return b;
    } else if (filterSelectedEmployeeId != "" && filterSelectedEmployeeName == "") {
      return a;
    } else {
      return a && b;
    }
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={1}>
          <DataTable
            paginationResetDefaultPage={resetPagination}
            fixedHeader
            fixedHeaderScrollHeight="400px"
            title="Daftar Karyawan"
            columns={[
              {
                cell: (row) => {
                  return (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        const find = selectedEmployees.find((item) => item.employeeId === row.employeeId);
                        if (find) {
                          setSelectedEmployees((selectedEmployees) =>
                            selectedEmployees.filter((item) => item.employeeId !== find.employeeId),
                          );
                        } else {
                          setSelectedEmployees((selectedEmployees) => [...selectedEmployees, row]);
                        }
                      }}
                    >
                      <Icon>{"check"}</Icon>
                    </IconButton>
                  );
                },
                maxWidth: "5px",
                center: true,
              },
              ...sameColumnTableEmployee,
            ]}
            data={employees}
            customStyles={reactTableCustomStyles}
            dense
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={employeesCount}
            sortServer
            paginationComponentOptions={{ noRowsPerPage: true }}
            onChangeRowsPerPage={async (perPage, currentPage) => {
              setTablePerPage(perPage);
              await fetchEmployees();
            }}
            onChangePage={async (page, totalRows) => {
              await fetchEmployees(page);
            }}
            onSort={async (selectedColumn, sortDirection) => {
              if (selectedColumn.sortfield == null) return;
              setOrder(`${selectedColumn.sortfield}%20${sortDirection}`);
              await fetchEmployees();
            }}
            subHeader
            subHeaderComponent={
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    variant="outlined"
                    type={"text"}
                    label={t("employee_id")}
                    onChange={(e) => setFilterEmployeeId(e.target.value)}
                    value={filterEmployeeId}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              setIsSearch(true);
                            }}
                          >
                            <Icon>search</Icon>
                          </IconButton>
                          {isSearch && (
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => {
                                if (filterEmployeeId) {
                                  setResetPagination(!resetPagination);
                                  setFilterEmployeeId("");
                                  setIsSearch(false);
                                }
                              }}
                            >
                              <Icon>clear</Icon>
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    variant="outlined"
                    type={"text"}
                    label={t("employee_name")}
                    onChange={(e) => setFilterEmployeeName(e.target.value)}
                    value={filterEmployeeName}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              setIsSearch(true);
                            }}
                          >
                            <Icon>search</Icon>
                          </IconButton>
                          {isSearch && (
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => {
                                if (filterEmployeeName) {
                                  setResetPagination(!resetPagination);
                                  setFilterEmployeeName("");
                                  setIsSearch(false);
                                }
                              }}
                            >
                              <Icon>clear</Icon>
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={1}>
          <DataTable
            fixedHeader
            fixedHeaderScrollHeight="400px"
            title={`${selectedEmployees.length} Karyawan dipilih`}
            columns={[
              {
                cell: (row) => {
                  return (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedEmployees((selectedEmployees) => {
                          return selectedEmployees.filter((item) => item.employeeId !== row.employeeId);
                        });
                      }}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  );
                },
                maxWidth: "5px",
                center: true,
              },
              ...sameColumnTableEmployee,
            ]}
            data={filteredSelectedEmployees}
            customStyles={reactTableCustomStyles}
            dense
            pagination
            paginationComponentOptions={{ noRowsPerPage: true }}
            subHeader
            subHeaderComponent={
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    variant="outlined"
                    type={"text"}
                    label={t("employee_id")}
                    onChange={(e) => setFilterSelectedEmployeeId(e.target.value)}
                    value={filterSelectedEmployeeId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    variant="outlined"
                    type={"text"}
                    label={t("employee_name")}
                    onChange={(e) => setFilterSelectedEmployeeName(e.target.value)}
                    value={filterSelectedEmployeeName}
                  />
                </Grid>
              </Grid>
            }
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  setNavigation: Actions.setNavigation,
  setUser: AuthActions.setUser,
  createData,
  updateData,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const ReportEmployeeTableSelection = connector(_ReportEmployeeTableSelection);
