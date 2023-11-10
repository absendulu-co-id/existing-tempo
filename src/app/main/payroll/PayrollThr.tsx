import HeaderComponent from "../../components/HeaderComponent";
import { FuseLoading, FusePageCarded } from "@fuse";
import { Theme, WithStyles, withStyles } from "@material-ui/core";
import { Styles } from "@material-ui/styles";
import { RootState } from "app/store";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Redirect } from "react-router";

const styles: Styles<Theme, Props> = (theme: Theme) => ({
  layoutRoot: {},
});

interface Props extends WithTranslation, WithStyles<typeof styles, true> {}

interface States {
  redirect: boolean;
  loading: boolean;
}

class PayrollThr extends Component<Props, States> {
  state = {
    redirect: false,
    loading: false,
  };

  componentDidMount() {
    // this.setState({ loading: false });
  }

  render() {
    const { classes, t } = this.props;
    const { redirect, loading } = this.state;
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
        content={<div className="pb-24"></div>}
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
)(withStyles(styles, { withTheme: true })(withTranslation()(PayrollThr)));
