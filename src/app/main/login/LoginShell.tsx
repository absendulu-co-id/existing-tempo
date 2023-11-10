import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import ServerConfig from "./ServerConfig";
import BackdropLoadingComponent from "@/app/components/BackdropLoadingComponent";
import { Card, CardContent, Grid, makeStyles, Typography } from "@material-ui/core";
import { memo, useState } from "react";
import { Route, Switch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "white",
    color: theme.palette.primary.contrastText,
    height: "100vh",
    width: "100vw",
  },
}));

const _LoginShell: React.FC = () => {
  const classes = useStyles();
  const loadingState = useState<boolean>(false);
  const titleState = useState<(() => React.ReactNode) | string>("");

  const style: any = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }

  return (
    <div className={classes.root}>
      <Grid container alignItems="center" className="h-full">
        <Grid item xs={12} md={6} lg={8} xl={9} className="sm:p-16 md:p-16 lg:p-64 logo-login">
          <picture>
            <source srcSet="assets/images/logos/logo.svg" type="image/svg+xml" />
            <img className="h-600" src="assets/images/logos/logo.png" alt="absendulu.id" />
          </picture>
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={3} className="h-full">
          <Card square className="h-full">
            <BackdropLoadingComponent isLoading={loadingState[0]} />
            <CardContent className="p-16 md:pt-128">
              {typeof titleState[0] === "string" && (
                <Typography variant="h4" className="text-center" component="h1" gutterBottom>
                  {titleState[0]}
                </Typography>
              )}
              {typeof titleState[0] !== "string" && titleState[0]}
              <Switch>
                <Route path="/login" exact>
                  <Login loadingState={loadingState} titleState={titleState} />
                </Route>
                <Route path="/forgot-password" exact>
                  <ForgotPassword loadingState={loadingState} titleState={titleState} />
                </Route>
                <Route path="/forgot-password/:uuid" exact>
                  <ResetPassword loadingState={loadingState} titleState={titleState} />
                </Route>
                <Route path="/server-config" exact>
                  <ServerConfig loadingState={loadingState} titleState={titleState} />
                </Route>
              </Switch>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export const LoginShell = memo(_LoginShell);
