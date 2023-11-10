import * as Sentry from "@sentry/react";
import { TextFieldFormsy } from "@fuse";
import { Button, Grid, IconButton, InputAdornment, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { checkFirst } from "app/helper/checkService";
import Formsy from "formsy-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

interface Props {
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  titleState: [
    (() => React.ReactNode) | string | null,
    React.Dispatch<React.SetStateAction<(() => React.ReactNode) | string>>,
  ];
}

const ServerConfig: React.FC<Props> = ({ loadingState, titleState, ...props }) => {
  const [company, setCompany] = useState(localStorage.getItem("companyUrl") ?? "");
  const [api, setApi] = useState(localStorage.getItem("apiUrl") ?? "");
  const [isFormValid, setIsFormValid] = useState(false);
  const [backdropLoading, setBackdropLoading] = loadingState;

  useEffect(() => {
    titleState[1](() => {
      return (
        <Grid container alignItems="center">
          <Grid item>
            <IconButton aria-label="back" component={Link} to={"/login"}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" className="text-center" component="h1" gutterBottom>
              Server Configuration
            </Typography>
          </Grid>
        </Grid>
      );
    });
  }, []);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = async () => {
    setBackdropLoading(true);

    let url = `https://${company.trim()}.${api.trim()}.absendulu.com`;

    if (api.includes("http")) {
      url = api;
    }

    localStorage.setItem("companyUrl", company);
    localStorage.setItem("apiUrl", api);
    localStorage.setItem("serverUrl", url);
    await checkFirst()
      .then(async () => {
        setBackdropLoading(false);
        Sentry.setContext("serverConfig", {
          companyUrl: company,
          apiUrl: api,
          serverUrl: url,
        });
        await swal("Berhasil!", "Berhasil terhubung ke " + url, "success");
        (window as Window).location = "./";
      })
      .catch((_) => {
        setBackdropLoading(false);
        localStorage.removeItem("serverUrl");
        void swal("Gagal!", "Tidak dapat terhubung ke " + url, "error");
      });
  };

  return (
    <Formsy onValidSubmit={handleSubmit} onValid={enableButton} onInvalid={disableButton} className="w-full mt-80">
      <Grid container spacing={1} alignItems="center" className="mb-16">
        <Grid item xs={12} sm={4}>
          <TextFieldFormsy
            type="text"
            name="company"
            label="Company"
            onChange={(e) => setCompany(e.target.value)}
            value={company}
            variant="standard"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="h6">.</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextFieldFormsy
            type="text"
            name="url"
            label="Server API"
            onChange={(e) => setApi(e.target.value)}
            value={api}
            variant="standard"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">.absendulu.com</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="w-full mx-auto mt-16 normal-case"
        disabled={!isFormValid}
        value="legacy"
      >
        Submit
      </Button>
    </Formsy>
  );
};

export default ServerConfig;
