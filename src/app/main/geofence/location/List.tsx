import HeaderComponent from "../../../components/HeaderComponent";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Grid, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { AccordionSearch } from "app/components/AccordionSearch";
import { MyMaterialTable } from "app/components/MyMaterialTable";
import { RootState } from "app/store";
import Axios from "axios";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  redirect: boolean;
  loading: boolean;
  searchName: string;
  searchAddress: string;
  data: any[];
}

const styles = (theme: Theme) => ({
  layoutRoot: {},
});

class ListLocation extends Component<Props, States> {
  state: States = {
    redirect: false,
    loading: false,
    searchName: "",
    searchAddress: "",
    data: [],
  };

  onClearSearch = () => {
    this.setState({
      searchAddress: "",
      searchName: "",
    });
  };

  onSearch = () => {};

  getData = async () => {
    const res = await Axios.get("/v1/location");
    this.setState({
      data: res.data.data,
    });
  };

  componentDidMount = async () => {
    await this.getData();
  };

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
    const href = window.location.pathname.split("/");
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title}`;

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
          <div className="m-16">
            <AccordionSearch onClearSearch={this.onClearSearch} onSearch={this.onSearch}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nama"
                    type="search"
                    variant="outlined"
                    value={this.state.searchName}
                    onChange={(e) => this.setState({ searchName: e.target.value })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Alamat"
                    type="search"
                    variant="outlined"
                    value={this.state.searchAddress}
                    onChange={(e) => this.setState({ searchAddress: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </AccordionSearch>

            <MyMaterialTable
              columns={[
                {
                  label: "ID",
                  field: "locationId",
                },
              ]}
              data={[{}]}
            />
          </div>
        }
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(ListLocation)));
