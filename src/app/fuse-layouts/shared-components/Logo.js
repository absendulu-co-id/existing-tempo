import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  "logo-icon": {
    filter:
      "drop-shadow(2px 0px 0 #FFF) drop-shadow(-2px 0px 0 #FFF) drop-shadow(0px 2px 0 #FFF) drop-shadow(0px -2px 0 #FFF)",
    userSelect: "none",
    pointerEvents: "none",
    userDrag: "none",
  },
}));

function Logo() {
  const classes = useStyles();

  return (
    <picture className="w-full h-full">
      <source srcSet="assets/images/logos/logo.svg" type="image/svg+xml" />
      <img
        className={classes["logo-icon"] + " logo-icon w-full h-full"}
        src="assets/images/logos/logo.png"
        alt="absendulu.id"
        draggable="false"
      />
    </picture>
  );
}

export default Logo;
