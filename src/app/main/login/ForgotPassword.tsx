import { TextFieldFormsy } from "@fuse";
import { Button, Grid, Icon, IconButton, InputAdornment, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "axios";
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

const useStyles = makeStyles((theme) => ({
  root: {
    background: "white",
    color: theme.palette.primary.contrastText,
  },
}));

const ForgotPassword: React.FC<Props> = ({ loadingState, titleState, ...props }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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
              Lupa Password
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
    const origin = window.location.origin;
    setBackdropLoading(true);
    const serverUrl = localStorage.getItem("serverUrl");
    if (!serverUrl) {
      setBackdropLoading(false);
      return await swal("Gagal!", "Tidak dapat terhubung dengan API, silahkan hubungi adminitrator", "error");
    }
    const data = {
      username,
      email,
      url: origin,
    };

    axios
      .post("/auth/forgotPassword", data)
      .then(async (res) => {
        if (res.status === 200) {
          setBackdropLoading(false);
          await swal("Berhasil!", "URL lupa password telah dikirim ke " + email, "success");
        }
      })
      .catch(async () => {
        setBackdropLoading(false);
        await swal("Gagal!", "Nama Pengguna atau Email tidak sesuai!", "error");
      });
  };

  return (
    <Formsy onValidSubmit={handleSubmit} onValid={enableButton} onInvalid={disableButton} className="w-full mt-80">
      <TextFieldFormsy
        className="mb-16"
        type="text"
        name="username"
        label="Nama Pengguna"
        onChange={(evt) => setUsername(evt.target.value)}
        value={username}
        validations={{
          minLength: 4,
        }}
        validationErrors={{
          minLength: "Minimal panjang karakter 4",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Icon className="text-20" color="action">
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
        type="text"
        name="email"
        label="Email"
        onChange={(evt) => setEmail(evt.target.value)}
        value={email}
        validations={"isEmail"}
        validationErrors={{
          isEmail: "Email tidak valid",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Icon className="text-20" color="action">
                email
              </Icon>
            </InputAdornment>
          ),
        }}
        variant="outlined"
        required
      />
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

export default ForgotPassword;
