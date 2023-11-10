import { Breadcrumbs, createStyles, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import routes from "app/fuse-configs/routesConfig";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(0.5),
    },
  }),
);

function HeaderComponent(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Toolbar>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="textPrimary" to="/">
          {t("home")}
        </Link>
        ;
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const text = to.split("/").at(-1)?.replaceAll(/-/g, "_");
          const routeExist = routes.some((x) => x.path == to);

          if (last || !routeExist) {
            return (
              <Typography color="textPrimary" key={to}>
                {t(text!, { defaultValue: text?.toCapitalCase() })}
              </Typography>
            );
          }

          return (
            <Link color="textPrimary" key={to} to={to}>
              {t(text!, { defaultValue: text?.toCapitalCase() })}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Toolbar>
  );
}

export default HeaderComponent;
