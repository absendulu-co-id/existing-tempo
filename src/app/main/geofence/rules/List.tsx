import HeaderComponent from "../../../components/HeaderComponent";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Grid, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { AccordionSearch } from "app/components/AccordionSearch";
import { RootState } from "app/store";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  redirect: boolean;
  loading: boolean;
}

const styles = (theme: Theme) => ({
  layoutRoot: {},
});

class ListRules extends Component<Props, States> {
  state = {
    redirect: false,
    loading: false,
  };

  componentDidMount() {}

  onClearSearch() {}

  onSearch() {}

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
            <AccordionSearch onClearSearch={() => this.onClearSearch()} onSearch={() => this.onSearch()}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="name, address" type="search" variant="outlined" fullWidth />
                </Grid>
              </Grid>
            </AccordionSearch>
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

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(ListRules)));
