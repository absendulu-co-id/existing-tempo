import { AppBar, Button, Grid, Toolbar, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { RootState } from "app/store";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

const FooterLayout1: React.FC = (props) => {
  const footerTheme = useSelector(({ fuse }: RootState) => fuse.settings.footerTheme);

  const getDateString = () => {
    const lastUpdateMoment = moment(process.env.REACT_APP_BUILD_TIME_STAMP);
    const formattedDate = lastUpdateMoment.toISOString();

    return formattedDate;
  };

  return (
    <MuiThemeProvider theme={footerTheme}>
      <AppBar component={"footer"} className="relative z-10" color="default">
        <Toolbar className="mx-16 my-8">
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={12} md className="text-center md:text-right">
              <Typography component="p">
                <Button href="https://absendulu.id" target="_blank" className="normal-case">
                  absendulu.id
                </Button>
                <Button href="https://absendulu.id/faq" target="_blank" className="normal-case">
                  FAQ
                </Button>
                <Button href="https://kb.absendulu.com" target="_blank" className="normal-case">
                  Knowledge Base
                </Button>
                <Button
                  href="https://api.whatsapp.com/send/?phone=6287779939366&text&type=phone_number&app_absent=0"
                  target="_blank"
                  className="normal-case"
                >
                  Whatsapp Us!
                </Button>
              </Typography>
            </Grid>

            <Grid item xs={12} md className="text-center md:text-right">
              <Typography component="p" className="mb-4">
                &copy; Copyright {moment().format("YYYY")}{" "}
                <a href="https://absendulu.id" target="_blank" rel="noreferrer">
                  {process.env.REACT_APP_WEBSITE_NAME}
                </a>
              </Typography>
              <Typography component="p" variant="caption" style={{ fontSize: "7pt" }}>
                Build {getDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

export default FooterLayout1;
