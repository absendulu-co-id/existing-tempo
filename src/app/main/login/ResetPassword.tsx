import { FuseLoading, TextFieldFormsy } from "@fuse";
import { Button, Icon, InputAdornment, Typography } from "@material-ui/core";
import axios from "axios";
import Formsy from "formsy-react";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";

interface Props {
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  titleState: [
    (() => React.ReactNode) | string | null,
    React.Dispatch<React.SetStateAction<(() => React.ReactNode) | string>>,
  ];
}

const ResetPassword: React.FC<Props> = ({ loadingState, ...props }) => {
  const href = window.location.pathname.split("/");

  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isValidUUID, setIsValidUUID] = useState(false);
  const [verificationTokenUUID, setVerificationTokenUUID] = useState<string | null>(null);
  const [backdropLoading, setBackdropLoading] = loadingState;

  useEffect(() => {
    if (href[2]) {
      axios
        .get(`/auth/verificationTokenValidator/${href[2]}`)
        .then((res) => {
          if (res.status === 200) {
            setVerificationTokenUUID(href[2]);
            setIsValidUUID(true);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
          setIsValidUUID(false);
        });
    } else {
      setLoading(false);
      setIsValidUUID(false);
    }
  }, [href]);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = async () => {
    setBackdropLoading(true);
    const data = {
      verificationTokenUUID,
      password,
    };

    const res = await axios.patch("/auth/forgotPassword", data).catch(async (err) => {
      setBackdropLoading(false);
      await swal("Error", err.response.data.message, "error");
    });

    if (res?.status === 200) {
      setBackdropLoading(false);
      return swal("Berhasil!", res.data?.message, "success").then(() => {
        setRedirectLogin(true);
        (window as Window).location = "./";
      });
    }
  };

  if (loading) {
    return <FuseLoading />;
  }

  if (redirect) {
    return <Redirect to="/my_dashboard/summary" />;
  } else if (redirectLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <Formsy
      onValidSubmit={handleSubmit}
      onValid={enableButton}
      onInvalid={disableButton}
      className="flex flex-col justify-center w-full my-32 "
    >
      {isValidUUID ? (
        <div>
          <TextFieldFormsy
            className="mb-16"
            type="password"
            name="password"
            label="Password"
            onChange={(evt) => setPassword(evt.target.value)}
            value={password}
            validations={{
              minLength: 6,
            }}
            validationErrors={{
              minLength: "Minimal panjang karakter 6",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className="text-20" color="action">
                    password
                  </Icon>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            required
          />
          <TextFieldFormsy
            className="mb-16"
            type="password"
            name="confirmationPassword"
            label="Konfirmasi Password"
            onChange={(evt) => setConfirmationPassword(evt.target.value)}
            value={confirmationPassword}
            validations={{ equalsField: "password" }}
            validationErrors={{
              equalsField: "Isi field tidak sama dengan Field Password",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className="text-20" color="action">
                    password
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
        </div>
      ) : (
        <div>
          <Typography variant="subtitle1" className="text-center md:w-full mb-16">
            Tautan pengaturan ulang password tidak valid, mungkin karena telah digunakan atau kedaluwarsa. Silakan minta
            reset password baru.
            <br />
            <br />
            <Link color="primary" className="font-medium" style={{ color: "#103B1D" }} to={"/forgot-password"}>
              Kembali Lupa Password?
            </Link>
          </Typography>
        </div>
      )}
    </Formsy>
  );
};

export default ResetPassword;
