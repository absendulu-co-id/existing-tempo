import { Icon, Input, Paper, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

function Error404Page() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-16">
      <div className="max-w-512 text-center">
        <Typography variant="h1" color="inherit" className="font-medium mb-16">
          404
        </Typography>

        <Typography variant="h5" color="textSecondary" className="mb-16">
          Sorry but we could not find the page you are looking for
        </Typography>

        <Paper className="flex items-center w-full h-56 p-16 mt-48 mb-16" elevation={1}>
          <Icon color="action">search</Icon>
          <Input
            placeholder="Search for anything"
            className="pl-16"
            disableUnderline
            fullWidth
            inputProps={{
              "aria-label": "Search",
            }}
          />
        </Paper>

        <Typography className="font-medium" component={Link} to="/" style={{ color: "#103B1D" }}>
          Go back to dashboard
        </Typography>
      </div>
    </div>
  );
}

export default Error404Page;
