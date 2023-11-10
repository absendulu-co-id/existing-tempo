import * as AuthActions from "../../../auth/store/actions";
import * as Actions from "../../../store/actions";
import * as Sentry from "@sentry/react";
import { TextFieldFormsy } from "@fuse";
import { Button, Grid, Icon, IconButton, InputAdornment } from "@material-ui/core";
import BackdropLoadingComponent from "app/components/BackdropLoadingComponent";
import { RootState } from "app/store";
import Formsy from "formsy-react";
import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const formRef = null;

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation {}

class JWTLoginTab extends Component<Props> {
  state = {
    isFormValid: false,
    username: "",
    password: "",
    backdropLoading: false,
    redirect: false,
    redirectServerConfig: false,
    showPassword: false,
  };

  disableButton = () => {
    this.setState({
      isFormValid: false,
    });
  };

  enableButton = () => {
    this.setState({
      isFormValid: true,
    });
  };

  handleSubmit = async () => {
    this.setState({
      backdropLoading: true,
    });
    const serverUrl = localStorage.getItem("serverUrl");
    if (!serverUrl) {
      this.setState({ backdropLoading: false });
      return await swal("Gagal!", "Tidak dapat terhubung dengan API, silahkan hubungi adminitrator", "error");
    }
    const { username, password } = this.state;
    const loginData = {
      username,
      password,
    };

    await this.props.submitLogin(loginData);
  };

  handleInputChange = (event) => {
    const nama = event.target.name;
    const value = event.target.value;
    this.setState({
      [nama]: value,
    });
  };

  handleDemoSubmit = async () => {
    Sentry.setContext("serverConfig", {
      serverUrl: "https://demo.api1.absendulu.com",
    });
    localStorage.setItem("serverUrl", "https://demo.api1.absendulu.com");
    this.setState({
      backdropLoading: true,
    });

    await this.props.submitLogin({
      username: "hradmin",
      password: "123456",
    });
  };

  handleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/my_dashboard/summary" />;
    }
    if (this.state.redirectServerConfig) {
      return <Redirect to="/server-config" />;
    }
    if (this.props.login.success) {
      (window as Window).location = "my_dashboard/summary";
    }

    return (
      <div className="w-full">
        <BackdropLoadingComponent isLoading={this.state.backdropLoading && !this.props.login.isFinish} />
        <Formsy
          onValidSubmit={this.handleSubmit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          ref={formRef}
          className="flex flex-col justify-center w-full"
        >
          <TextFieldFormsy
            className="mb-16"
            type="text"
            name="username"
            label="Username"
            onChange={this.handleInputChange}
            value={this.state.username}
            validations={{
              minLength: 4,
            }}
            validationErrors={{
              minLength: "Minimal panjang karakter 4",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className="text-20 mr-12" color="action">
                    perm_identity
                  </Icon>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            required
          />

          <TextFieldFormsy
            className="mb-16"
            type={this.state.showPassword ? "text" : "password"}
            name="password"
            label="Password"
            onChange={this.handleInputChange}
            value={this.state.password}
            validations={{
              minLength: 6,
            }}
            validationErrors={{
              minLength: "Minimal panjang karakter 6",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                    <Icon className="text-20" color="action">
                      {this.state.showPassword ? "visibility" : "visibility_off"}
                    </Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full normal-case"
                aria-label="LOG IN"
                disabled={!this.state.isFormValid}
                value="legacy"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} md>
              <Button
                variant="contained"
                color="secondary"
                className="w-full normal-case"
                component={Link}
                to={"/server-config"}
              >
                Server Configuration
              </Button>
            </Grid>
          </Grid>
        </Formsy>

        <Button size="small" className="mt-16 normal-case text-right" component={Link} to={"/forgot-password"}>
          Lupa Password?
        </Button>

        <Button
          variant="contained"
          size="large"
          color="primary"
          className="w-full sm:mt-40 md:mt-80 normal-case"
          onClick={this.handleDemoSubmit}
        >
          Coba Admin absendulu.id (DEMO)
        </Button>
      </div>
    );
  }
}

const mapStatetoProps = (state: RootState) => {
  return {
    login: state.auth.login,
  };
};

const mapDispatchToProps = {
  setNavigation: Actions.setNavigation,
  setUser: AuthActions.setUser,
  submitLogin: AuthActions.submitLogin,
};

const connector = connect(mapStatetoProps, mapDispatchToProps);

export default connector(withTranslation()(JWTLoginTab));
