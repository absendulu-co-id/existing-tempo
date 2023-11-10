/* eslint-disable @typescript-eslint/consistent-type-assertions */
import HeaderComponent from "../../../components/HeaderComponent";
import history from "../../../services/history";
import { rosterConfig } from "./Config";
import { AccordionSearch } from "@/app/components/AccordionSearch";
import { FuseLoading, FusePageCarded, SelectFormsy } from "@fuse";
import { HotColumn, HotColumnProps, HotTable, HotTableProps } from "@handsontable/react";
import { Options } from "@material-table/core";
import {
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
  withStyles,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { WithStyles } from "@material-ui/styles";
import { Shift } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { MyColumn, MyMaterialTable } from "app/components/MyMaterialTable";
import axios from "axios";
import Formsy from "formsy-react";
import { DropdownCellType, registerCellType } from "handsontable/cellTypes";
import { AutoColumnSize, DragToScroll, ManualColumnResize, registerPlugin } from "handsontable/plugins";
import moment from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import swal from "sweetalert";

registerCellType(DropdownCellType);
registerPlugin(AutoColumnSize);
registerPlugin(ManualColumnResize);
registerPlugin(DragToScroll);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  isFormValid: boolean;
  success: boolean;
  redirect: boolean;
  loading: boolean;
  fixedWeeklyModal: boolean;
  data: {
    departmentId: string | null;
    departmentName: string | undefined;
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  departmentData: any[];
  shiftData: Shift[];
  shiftDataTable: (typeof Shift.prototype.shiftId)[];
  fixedWeekly: Map<string, Shift | null>;
  defaultHotSettings: HotTableProps & { data: any };
  hotSettings: HotTableProps & { data: any };
  hotColumns: HotColumnProps[];
  legendColumns: MyColumn<any>[];
}

const styles = (theme: Theme) =>
  createStyles({
    layoutRoot: {},
  });

class Roster extends Component<Props, States> {
  state: States = {
    isFormValid: false,
    success: false,
    redirect: false,
    loading: true,
    fixedWeeklyModal: false,
    data: {
      departmentId: null,
      departmentName: undefined,
      startDate: moment().startOf("days"),
      endDate: moment().add(1, "month").endOf("month"),
    },
    departmentData: [],
    shiftData: [],
    shiftDataTable: [],
    fixedWeekly: new Map(),
    defaultHotSettings: {
      data: [],
      colHeaders: ["Employee Code", "Name"],
    },
    hotSettings: {
      data: [],
      colHeaders: ["Employee Code", "Name"],
    },
    hotColumns: [],
    legendColumns: [
      {
        title: "Kode Shift",
        field: "shiftId",
      },
      {
        title: "Shift",
        field: "shiftName",
      },
      {
        title: "Jadwal",
        render: (rowData) => {
          let timeTable = "";
          rowData.timeTables.forEach((row) => {
            if (timeTable !== "") {
              timeTable += ", ";
            }
            timeTable += row.timeTableId;
          });
          return timeTable;
        },
      },
    ],
  };

  handleInputChangeDepartment = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>, target) => {
    const selectedDeparment = this.state.departmentData.find((item) => item.departmentId == event.target.value);

    if (selectedDeparment == null) {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          departmentName: undefined,
          departmentId: null,
        },
      }));
      return;
    }

    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        departmentName: selectedDeparment.departmentName,
        departmentId: selectedDeparment.departmentId,
      },
    }));
  };

  handleInputChangeWeeklyShift = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
    day: string,
  ) => {
    const shift = this.state.shiftData.find((x) => x.shiftId == event.target.value);
    if (shift == null) throw new Error("Shift not found");

    this.setState((prevState) => {
      prevState.fixedWeekly.set(day, shift);
      return {
        fixedWeekly: prevState.fixedWeekly,
      };
    });
  };

  handleSubmitFixWeeklyShift = () => {
    const fixedWeekly = this.state.fixedWeekly;
    const convertData: any[] = [];

    this.state.hotSettings.data.forEach((data) => {
      const rosterDates = Object.keys(data).filter((itemFilter) => itemFilter.includes("-"));
      let itemRoster = {
        employeeName: data.employeeName,
        employeeId: data.employeeId,
      };

      rosterDates.forEach((rosterDate) => {
        const shiftObject = {
          [rosterDate]: fixedWeekly.get(moment(rosterDate, "DD-MM-YYYY").format("dddd"))?.shiftId ?? data[rosterDate],
        };
        itemRoster = Object.assign({}, itemRoster, shiftObject);
      });

      convertData.push(itemRoster);
    });

    return convertData;
  };

  getSelectData = async (setLoading: boolean = true) => {
    if (setLoading) this.setState({ loading: true });

    const filterDefaultOrganization =
      this.props.user.data.userType !== "mid-admin" && this.props.user.data.defaultOrganizationAccess
        ? `&filter[where][organizationId]=${this.props.user.data.defaultOrganizationAccess.organizationId}`
        : "";

    const res = await Promise.all([
      axios.get("/Shift?filter[order]=shiftName ASC"),
      axios.get(`/Department?filter[order]=departmentName ASC${filterDefaultOrganization}`),
    ]);

    this.setState({
      shiftData: res[0].data.rows.map((x) => ({ ...x, id: x.shiftId })),
      shiftDataTable: ["", ...res[0].data.rows.map((item) => item.shiftId)],
      departmentData: res[1].data.rows,
    });
    if (setLoading) this.setState({ loading: false });
  };

  handleGenerateList = async (setLoading: boolean = true) => {
    if (setLoading) this.setState({ loading: true });

    this.setState({
      hotSettings: this.state.defaultHotSettings,
      hotColumns: [],
    });

    try {
      const res = await axios.get(`/${rosterConfig.endPoint}-List`, {
        params: {
          ...this.state.data,
          endDate: this.state.data.endDate.toISOString(),
          startDate: this.state.data.startDate.toISOString(),
        },
      });

      if (res.data.length > 0) {
        const columns: HotColumnProps[] = Object.keys(res.data[0])
          .filter((x) => x.includes("-"))
          .map((obj) => ({
            data: obj,
          }));

        const colHeader = Object.keys(res.data[0])
          .filter((x) => x.includes("-"))
          .map((obj) => moment(obj, "DD-MM-YYYY").format("DD/MM"));

        this.setState((prevState) => ({
          hotSettings: {
            data: res.data,
            colHeaders: [...(prevState.hotSettings.colHeaders as string[]), ...colHeader],
          },
          hotColumns: [...prevState.hotColumns, ...columns],
        }));
      }
    } catch (error: any) {
      await swal("Error", error?.response?.data.message, "error");
    }
    if (setLoading) this.setState({ loading: false });
  };

  handleSubmit = () => {
    this.setState({
      loading: !this.state.loading,
    });
    const data = this.state.hotSettings.data;
    axios
      .post(`/${rosterConfig.endPoint}-Submit`, data)
      .then(async (res) => {
        if (res.status === 200) {
          await swal("Berhasil", "Data berhasil disimpan", "success");
          await this.handleGenerateList();
        }
      })
      .catch(async (err) => {
        this.setState({
          loading: !this.state.loading,
        });
        if (err.response.data) {
          await swal("Error", err.response.data.message, "error");
        }
      });
  };

  resetFixedWeekly = () => {
    const weekdays = new Map<string, Shift | null>();
    for (let i = 1; i <= 7; i++) {
      weekdays.set(moment().isoWeekday(i).format("dddd"), null);
    }
    this.setState({
      fixedWeekly: weekdays,
    });
  };

  async componentDidMount() {
    await Promise.all([this.getSelectData(false), this.handleGenerateList(false)]);
    this.resetFixedWeekly();
    this.setState({ loading: false });
  }

  render() {
    const href = window.location.pathname.split("/");
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title2}`;
    const title3 = "Pengaturan " + title2 + " " + t(href[3]);

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading) {
      return <FuseLoading />;
    }

    return (
      <React.Fragment>
        <FusePageCarded
          classes={{
            root: classes.layoutRoot,
          }}
          header={<HeaderComponent breadcrumbs={[title, title2, title3]} titlePage={title3} />}
          contentToolbar={
            <div className="px-24">
              <h2>{title2 + " " + t(href[3])}</h2>
            </div>
          }
          content={
            <div className="m-16">
              <Formsy>
                <AccordionSearch
                  onSearch={async () => await this.handleGenerateList()}
                  onClearSearch={() =>
                    this.setState(
                      {
                        data: {
                          departmentId: null,
                          departmentName: undefined,
                          startDate: moment().startOf("days"),
                          endDate: moment().add(1, "month").endOf("month"),
                        },
                      },
                      async () => await this.handleGenerateList(),
                    )
                  }
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <KeyboardDatePicker
                        fullWidth
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="Start Date"
                        value={this.state.data.startDate}
                        onChange={(date) => {
                          if (date == null) return;
                          this.setState((prevState) => ({
                            data: { ...prevState.data, startDate: date },
                          }));
                        }}
                        maxDate={this.state.data.endDate.toDate()}
                        format="DD/MM/yyyy"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <KeyboardDatePicker
                        fullWidth
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="End Date"
                        value={this.state.data.endDate}
                        onChange={(date) => {
                          if (date == null) return;
                          this.setState((prevState) => ({
                            data: { ...prevState.data, endDate: date },
                          }));
                        }}
                        minDate={this.state.data.startDate.toDate()}
                        format="DD/MM/yyyy"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <SelectFormsy
                        fullWidth
                        name="departmentId"
                        label="Departemen"
                        value={[this.state.data.departmentId]}
                        variant="outlined"
                        onChange={this.handleInputChangeDepartment}
                        required={true}
                      >
                        <MenuItem value="">Semua Departemen</MenuItem>
                        {this.state.departmentData.map((item, index) => (
                          <MenuItem key={index} value={item.departmentId}>
                            {item.departmentName}
                          </MenuItem>
                        ))}
                      </SelectFormsy>
                    </Grid>
                  </Grid>
                </AccordionSearch>
              </Formsy>

              <Button
                variant="contained"
                className="ml-8 mt-8"
                color="primary"
                disabled={this.state.hotSettings.data!.length == 0}
                onClick={() => {
                  this.setState({ fixedWeeklyModal: true });
                }}
              >
                Tetapkan Mingguan
              </Button>

              <HotTable
                style={{ marginLeft: "-1.6rem", marginRight: "-1rem" }}
                className="mt-16"
                colHeaders={["Employee Code", "Name"]}
                rowHeaders
                fixedColumnsLeft={2}
                autoColumnSize
                manualColumnResize={true}
                licenseKey="non-commercial-and-evaluation"
                width="calc(100% + 2.6rem)"
                height="65vh"
                fillHandle={false}
                allowInvalid={false}
                selectionMode="single"
                trimDropdown={false}
                {...this.state.hotSettings}
              >
                <HotColumn readOnly disableVisualSelection data="employeeId" />
                <HotColumn readOnly disableVisualSelection data="employeeName" />
                {this.state.hotColumns.map((item, index) => (
                  <HotColumn
                    source={this.state.shiftDataTable}
                    selectOptions={this.state.shiftDataTable}
                    type="dropdown"
                    {...item}
                    key={index}
                  />
                ))}
              </HotTable>

              <Button variant="contained" className="mt-16" onClick={() => history.goBack()}>
                Batal
              </Button>
              <Button
                disabled={this.state.hotSettings.data!.length == 0}
                variant="contained"
                color="primary"
                className="mt-16 ml-8"
                onClick={() => this.handleSubmit()}
              >
                Simpan
              </Button>

              <Grid container className="mt-16">
                <Grid item xs={12} md={6}>
                  <MyMaterialTable
                    columns={this.state.legendColumns}
                    data={this.state.shiftData}
                    title="Daftar Shift"
                    options={
                      {
                        paging: false,
                        headerStyle: undefined,
                        cellStyle: {
                          borderRight: "1px solid #eee",
                        },
                      } as Options<any> & { cellStyle?: React.CSSProperties }
                    }
                  />
                </Grid>
              </Grid>
            </div>
          }
        />
        <Dialog
          fullWidth
          maxWidth="xs"
          open={this.state.fixedWeeklyModal}
          onClose={() =>
            this.setState({
              fixedWeeklyModal: false,
            })
          }
        >
          <DialogTitle>Mingguan</DialogTitle>
          <DialogContent>
            {Array.from(this.state.fixedWeekly.keys()).map((day, i) => {
              return (
                <Grid container spacing={1} alignItems="center" key={i}>
                  <Grid item xs={3}>
                    <Typography>{moment().day(day).format("dddd")}</Typography>
                  </Grid>
                  <Grid item xs>
                    <FormControl variant="outlined" className="mt-6" fullWidth>
                      <InputLabel>Shift</InputLabel>
                      <Select
                        name="shiftId"
                        label="Shift"
                        value={[this.state.fixedWeekly.get(day)?.shiftId]}
                        onChange={(event) => this.handleInputChangeWeeklyShift(event, day)}
                      >
                        <MenuItem value="" disabled>
                          Pilih Shift
                        </MenuItem>
                        {this.state.shiftData.map((item, index) => (
                          <MenuItem key={index} value={item.shiftId}>
                            {item.shiftName}
                            <Chip label={item.shiftId} size="small" className="ml-4" />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({
                  fixedWeeklyModal: false,
                });
              }}
            >
              Batal
            </Button>
            <Button
              color="primary"
              onClick={() => {
                const fixedWeeklyRoster = this.handleSubmitFixWeeklyShift();
                this.setState((prevState) => ({
                  fixedWeeklyModal: false,
                  hotSettings: {
                    ...prevState.hotSettings,
                    data: fixedWeeklyRoster,
                  },
                }));
              }}
            >
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(Roster)));
