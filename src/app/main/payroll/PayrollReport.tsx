import HeaderComponent from "../../components/HeaderComponent";
import DateFnsUtils from "@date-io/date-fns";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Container, FormControl, Grid, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Styles } from "@material-ui/styles";
import { RootState } from "app/store";
import moment, { Moment } from "moment";
import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

interface Props extends WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  redirect: boolean;
  loading: boolean;
  selectedDate: Moment;
}

class PayrollReport extends Component<Props, States> {
  state = {
    redirect: false,
    loading: false,
    selectedDate: moment(),
  };

  setSelectedDate = (date: Moment) => {
    this.setState({ selectedDate: date });
  };

  componentDidMount() {
    // this.setState({ loading: false });
  }

  currentYear = new Date().getFullYear();
  minYear = this.currentYear - 10;
  maxYear = new Date().getFullYear() + 1;

  render() {
    const { classes, t } = this.props;
    const { redirect, loading, selectedDate } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title}`;

    if (redirect) {
      return <Redirect to="/login" />;
    } else if (loading) {
      return <FuseLoading />;
    }

    return (
      <FusePageCarded
        classes={{
          root: classes.layoutRoot,
        }}
        header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
        contentToolbar={
          <div className="px-24">
            <h2>{title2}</h2>
          </div>
        }
        content={
          <React.Fragment>
            <Container>
              <Grid container spacing={2} style={{ marginTop: "2rem" }}>
                <Grid spacing={2}>
                  <FormControl style={{ display: "flex", flexDirection: "row" }} size="small">
                    <div>
                      <h2>Select years</h2>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          value={selectedDate}
                          onChange={(date) => this.setSelectedDate(moment(date))}
                          views={["year"]}
                          // min date diisi berdasar tahun perusahaan berdiri
                          // default: 10 tahun kebelakang dari tahun berjalan
                          minDate={new Date(this.minYear, 0, 1)}
                          maxDate={new Date(this.maxYear, 0, 1)}
                          inputVariant="outlined"
                          TextFieldComponent={(props) => (
                            <TextField
                              {...props}
                              variant="outlined"
                              size="small"
                              style={{
                                fontSize: "0.875rem",
                                padding: "8px 12px",
                              }}
                            />
                          )}
                          style={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                            marginRight: "1rem",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div>
                      <h2>Select month</h2>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          value={selectedDate}
                          onChange={(date) => this.setSelectedDate(moment(date))}
                          views={["month"]}
                          format="MMMM"
                          inputVariant="outlined"
                          openTo="month"
                          TextFieldComponent={(props) => (
                            <TextField
                              {...props}
                              variant="outlined"
                              size="small"
                              style={{
                                fontSize: "0.875rem",
                                padding: "8px 12px",
                              }}
                            />
                          )}
                          style={{ marginTop: "1rem", marginBottom: "1rem" }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </FormControl>
                </Grid>
              </Grid>
              {/* select years & month utk mengambil data yg dijalankan dari run payroll (payroll period) */}
              <Grid container spacing={3}>
                <Grid spacing={2} style={{ marginTop: "2rem" }}>
                  {/* desc utk "Salary May 2022" mengikuti payroll period */}
                  <p
                    style={{
                      margin: "8px 0",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    Salary May 2022
                  </p>
                  <p style={{ margin: "4px 0" }}>Salary Detail</p>
                  <Link to="/payroll/report/payslip">
                    <p style={{ margin: "4px 0" }}>Payslip</p>
                  </Link>
                  {/* untuk yearly, compare & recap. SKip dl gak kekejar dan gak ada contoh pembanding nya */}
                  {/* <p style={{ margin: "4px 0" }}>Salary DetailYearly.xls</p>
                  <p style={{ margin: "4px 0" }}>Salary Detail Compare</p>
                  <p style={{ margin: "4px 0" }}>Salary Recapitulation (Payroll Component & Employee)</p> */}
                </Grid>
              </Grid>
            </Container>
          </React.Fragment>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(withTranslation()(PayrollReport)));
