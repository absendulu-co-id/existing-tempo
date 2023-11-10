import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import HeaderComponent from "../../../components/HeaderComponent";
import WidgetComponent from "../../../components/WidgetComponent";
import { FuseLoading, FusePageCarded } from "@fuse";
import loadable from "@loadable/component";
import { Box, Divider, Grid, Theme } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { makeStyles, StyleRules, WithStyles } from "@material-ui/styles";
import { UserState } from "app/auth/store/reducers/user.reducer";
import { RootState } from "app/store";
import axios from "axios";
import moment from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";

const C3Chart = loadable(() => import(/* webpackPreload: true */ "@spytec/react-c3js"));

const useEmptyTopTenStyles = makeStyles({
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    height: "95%",
    minHeight: "80px",
  },
  centerContent: {
    textAlign: "center",
    margin: "auto",
  },
});

const EmptyTopTen: React.FC = () => {
  const classes = useEmptyTopTenStyles();

  return (
    <div className={classes.centerContainer}>
      <Box className={classes.centerContent} fontWeight="fontWeightLight">
        Data belum tersedia
      </Box>
    </div>
  );
};

interface Props extends WithTranslation, WithStyles<typeof styles, true> {
  user: UserState;

  setNavigation: (navigation) => void;
  setUser: (user) => void;
}

interface States {
  loading: boolean;
  redirect: boolean;
  dataTable: any;
  topTenLeave: any[];
  topTenLate: any[];
  topTenOnTime: any[];
  topTenAbsent: any[];
  columnExpOrganization: any;
}

const styles = (theme: Theme): StyleRules => ({
  layoutRoot: {},
  root: {},
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  rootTwo: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
});

class Summary extends Component<Props, States> {
  state: States = {
    loading: false,
    redirect: false,
    dataTable: [],
    topTenLeave: [],
    topTenLate: [],
    topTenOnTime: [],
    topTenAbsent: [],
    columnExpOrganization: [
      {
        title: "Perusahaan",
        field: "organizationName",
      },
      {
        title: "Tanggal Habis Masa Aktif",
        field: "expiredAt",
        render: (rowData) => moment(rowData.expiredAt).format("DD-MM-YYYY HH:mm"),
      },
    ],
  };

  formatData = (data) => {
    const formatData = {
      json: data,
      keys: {
        x: "employeeName", // it's possible to specify 'x' when category axis
        value: [
          moment().format("YYYY-MM"),
          moment().subtract(1, "months").format("YYYY-MM"),
          moment().subtract(2, "months").format("YYYY-MM"),
        ],
      },
    };
    return formatData;
  };

  axisData = (label) => {
    const axisData = {
      x: {
        type: "category",
      },
      y: {
        label: {
          text: label,
          position: "outer-middle",
        },
      },
    };
    return axisData;
  };

  getDataTable = async () => {
    const filterPost = {
      year: moment().format("YYYY"),
      month: moment().format("MM"),
      ...(this.props.user.data.userType == "employee" ? { employeeId: this.props.user.data.defaultEmployeeId } : {}),
    };

    void axios.get("report/count-attendance", { params: filterPost }).then((summary) => {
      this.setState({
        dataTable: summary.data,
      });
    });

    const res = await Promise.all([
      axios.get("/Top-Ten-Late-Report", { params: filterPost }),
      axios.get("/Top-Ten-OnTime-Report", { params: filterPost }),
      axios.get("/Top-Ten-Absent-Report", { params: filterPost }),
      axios.get("/Top-Ten-Leave-Report", { params: filterPost }),
    ]);
    this.setState({
      topTenLate: res[0].data,
      topTenOnTime: res[1].data,
      topTenAbsent: res[2].data,
      topTenLeave: res[3].data,
    });
  };

  componentDidMount() {
    void this.getDataTable();
  }

  getExpiryColor(expireDate: moment.Moment) {
    if (expireDate.isBefore(moment().add(1, "month"))) {
      return "error";
    } else if (expireDate.isBefore(moment().add(3, "month"))) {
      return "warning";
    }
    return undefined;
  }

  render() {
    const { classes, t, user } = this.props;
    const { activeDevice, maxDevice, activeUserApp, maxUserApp } = user.data.defaultOrganizationAccess;
    const { loading, redirect } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title2}`;

    const expireDate = moment(this.props.user.data.defaultOrganizationAccess.expiredAt ?? "2000-01-01");
    // TODO DATE IS EXPIRED

    if (redirect) {
      // return <Redirect to="/login" />;
    } else if (loading) {
      return <FuseLoading />;
    }

    return (
      <FusePageCarded
        classes={{
          root: classes.layoutRoot,
        }}
        header={<HeaderComponent breadcrumbs={[title, title2]} titlePage={title2} />}
        content={
          <div className="my-8">
            <div className="ml-24 my-16">
              <h2>Laporan Bulan {moment().format("MMMM YYYY")}</h2>
            </div>
            <div className="px-8 mb-16">
              <Grid container spacing={1} className="text-center">
                <Grid item xs={6} sm={3} md={3}>
                  <WidgetComponent title="Total On Time" total={this.state.dataTable?.totalOnTime ?? "⠀"} />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <WidgetComponent title="Total Late" total={this.state.dataTable?.totalLate ?? "⠀"} />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <WidgetComponent title="Total Absent" total={this.state.dataTable?.totalAbsent ?? "⠀"} />
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <WidgetComponent
                    title="Total Leave Permission"
                    total={this.state.dataTable?.totalLeavePermission ?? "⠀"}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} className="text-center mt-4">
                {this.props.user.data.userType !== "employee" && (
                  <React.Fragment>
                    {(maxDevice > 0 || activeDevice > 0) && (
                      <Grid item xs={6} sm={3} md={3}>
                        <WidgetComponent title="Active Device" total={`${activeDevice ?? "⠀"} / ${maxDevice ?? "⠀"}`} />
                      </Grid>
                    )}
                    {(activeUserApp > 0 || maxUserApp > 0) && (
                      <Grid item xs={6} sm={3} md={3}>
                        <WidgetComponent title="Active App" total={`${activeUserApp ?? "⠀"} / ${maxUserApp ?? "⠀"}`} />
                      </Grid>
                    )}
                    <Grid item xs={6} sm={3} md={3}>
                      <WidgetComponent
                        title="Absendulu Expire"
                        total={expireDate.format("ll")}
                        color={this.getExpiryColor(expireDate)}
                      />
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </div>
            <Divider />
            {this.props.user.data.userType !== "employee" && (
              <div className="px-4">
                <h2 className="text-center my-8">Top 10</h2>
                <Grid container spacing={1} className="p-12 mt-10 text-center">
                  <Grid item xs={12} md={6}>
                    <h3>Telat</h3>
                    {this.state.topTenLate.length > 0 && (
                      <C3Chart data={this.formatData(this.state.topTenLate)} axis={this.axisData("Menit")} />
                    )}
                    {this.state.topTenLate.length == 0 && <EmptyTopTen />}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h3>Tepat Waktu</h3>
                    {this.state.topTenOnTime.length > 0 && (
                      <C3Chart data={this.formatData(this.state.topTenOnTime)} axis={this.axisData("Menit")} />
                    )}
                    {this.state.topTenOnTime.length == 0 && <EmptyTopTen />}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h3>Bolos</h3>
                    {this.state.topTenAbsent.length > 0 && (
                      <C3Chart data={this.formatData(this.state.topTenAbsent)} axis={this.axisData("Hari")} />
                    )}
                    {this.state.topTenAbsent.length == 0 && <EmptyTopTen />}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <h3>Cuti</h3>
                    {this.state.topTenLeave.length > 0 && (
                      <C3Chart data={this.formatData(this.state.topTenLeave)} axis={this.axisData("Hari")} />
                    )}
                    {this.state.topTenLeave.length == 0 && <EmptyTopTen />}
                  </Grid>
                </Grid>
              </div>
            )}
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setNavigation: (navigation) => {
      dispatch(Actions.setNavigation(navigation));
    },
    setUser: (user) => {
      dispatch(AuthActions.setUser(user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withTranslation()(Summary)));
