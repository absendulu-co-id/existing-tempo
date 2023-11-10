// import { Redirect } from "react-router";
// import { deleteToken } from "../../store/actions/auth/actionAuth";
import * as Actions from "../../store/actions";
import { TextFieldFormsy } from "@fuse";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Popover,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import Formsy from "formsy-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";

const formRef = null;

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.primary.contrastText,
  },
}));

function UserMenu(props) {
  const user = useSelector(({ auth }) => auth.user);
  const classes = useStyles();
  const dispatch = useDispatch();

  const [userMenu, setUserMenu] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [changePasswordValue, setChangePasswordValue] = useState({
    oldPassword: "",
    password: "",
    confirmationPassword: "",
  });

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { oldPassword, password } = changePasswordValue;
    const data = {
      oldPassword,
      password,
    };

    const res = await axios.post("/auth/changePassword", data).catch((err) => {
      void swal("Error", err.response.data?.message, "error");
    });

    if (res.status === 200) {
      setLoading(false);
      await swal(
        "Berhasil!",
        "Password berhasil diubah! Silahkan Login kembali dengan menggunakan password baru!",
        "success",
      );
      setChangePasswordModal(false);
      setChangePasswordValue({
        oldPassword: "",
        password: "",
        confirmationPassword: "",
      });
      // let token = localStorage.getItem("jwt_access_token");
      // dispatch(deleteToken(token));
      localStorage.clear();
      dispatch(Actions.setNavigation([]));
      // setRedirect(true);
      window.location = "./";
    }
  };

  const handleInputChange = (event) => {
    const nama = event.target.name;
    const value = event.target.value;
    setChangePasswordValue((prevState) => ({
      ...prevState,
      [nama]: value,
    }));
  };

  // if (redirect) {
  //   return <Redirect to="/login" />;
  // }

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={changePasswordModal}
        onClose={() => {
          setChangePasswordModal(false);
        }}
      >
        <DialogTitle>Ubah Password</DialogTitle>
        <Formsy
          onValidSubmit={handleSubmit}
          onValid={enableButton}
          onInvalid={disableButton}
          ref={formRef}
          className="flex flex-col justify-center w-full"
        >
          <DialogContent>
            <TextFieldFormsy
              className="mb-16"
              type="password"
              name="oldPassword"
              label="Password Lama"
              onChange={handleInputChange}
              value={changePasswordValue.oldPassword}
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
                      vpn_key
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
              name="password"
              label="Password Baru"
              onChange={handleInputChange}
              value={changePasswordValue.password}
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
                      vpn_key
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
              onChange={handleInputChange}
              value={changePasswordValue.confirmationPassword}
              validations={{ equalsField: "password" }}
              validationErrors={{
                equalsField: "Isi field tidak sama dengan Field Password",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      vpn_key
                    </Icon>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" disabled={!isFormValid || loading}>
              Konfirmasi
              {loading && <CircularProgress className="ml-3" color="inherit" size="2rem" />}
            </Button>
            <Button onClick={() => setChangePasswordModal(false)}>Batal</Button>
          </DialogActions>
        </Formsy>
      </Dialog>
      <Button className={classes.button} onClick={userMenuClick}>
        {user.data.photoURL ? (
          <Avatar className="" alt="user photo" src={user.data.photoURL} />
        ) : (
          <Avatar className="">%REACT_APP_WEBSITE_NAME%</Avatar>
        )}

        <div className="hidden md:flex flex-col ml-12 items-start">
          <Typography component="span" className="normal-case font-600 flex">
            {user.data.displayName
              ? user.data.userType === "employee"
                ? user.data.username + " - " + user.data.displayName
                : user.data.username
              : process.env.REACT_APP_WEBSITE_NAME}
          </Typography>
          <Typography className="text-11 capitalize">{user.role[0] ? user.role[0] : "USER"}</Typography>
        </div>

        <Icon className="text-16 ml-12 hidden sm:flex" variant="action">
          keyboard_arrow_down
        </Icon>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        <React.Fragment>
          <MenuItem onClick={() => setChangePasswordModal(true)}>
            <ListItemIcon className="min-w-40">
              <Icon>vpn_key</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Ubah Password" />
          </MenuItem>
          <MenuItem
            onClick={async () => {
              const willDelete = await swal({
                title: "Apakah anda yakin?",
                text: "Apakah anda yakin untuk Keluar dari Aplikasi?",
                icon: "warning",
                showCancelButton: true,
                buttons: true,
                dangerMode: true,
              });

              if (willDelete) {
                localStorage.removeItem("jwt_access_token");
                window.location = "./";
              }
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>exit_to_app</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Keluar" />
          </MenuItem>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default UserMenu;
