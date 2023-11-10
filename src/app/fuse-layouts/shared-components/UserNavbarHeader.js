import { AppBar, Avatar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    "&.user": {
      "& .username, & .email": {
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut,
        }),
      },
    },
  },
  avatar: {
    width: 64,
    height: 64,
    position: "absolute",
    top: 68,
    padding: 8,
    background: theme.palette.background.default,
    boxSizing: "content-box",
    left: "50%",
    transform: "translateX(-50%)",
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    "& > img": {
      borderRadius: "50%",
    },
  },
}));

function UserNavbarHeader(props) {
  const user = useSelector(({ auth }) => auth.user);

  const classes = useStyles();

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      classes={{ root: classes.root }}
      className="user relative flex flex-col items-center justify-center pt-0 pb-64 z-0"
    >
      <Typography className="username whitespace-no-wrap" variant="h6" color="inherit">
        {user.data.displayName ? user.data.displayName : process.env.REACT_APP_WEBSITE_NAME}
      </Typography>
      <Typography className="email opacity-70 whitespace-no-wrap capitalize" variant="subtitle1" color="inherit">
        {user.role[0] ? user.role[0] : "USER"}
      </Typography>

      <Avatar
        className={clsx(classes.avatar, "avatar")}
        alt="user photo"
        src={user.data.photoURL && user.data.photoURL !== "" ? user.data.photoURL : "assets/images/avatars/profile.jpg"}
      />
    </AppBar>
  );
}

export default UserNavbarHeader;
