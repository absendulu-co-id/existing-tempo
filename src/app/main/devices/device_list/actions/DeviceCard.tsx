import { Card, Grid, ListItem, ListItemText } from "@material-ui/core";
import React from "react";

interface Props {
  device: any;
  className?: string;
}

const DeviceCard: React.FC<Props> = ({ device, className }) => {
  return (
    <Card variant="outlined" className={"mb-2 " + className}>
      <Grid container justifyContent="center" alignItems="center" spacing={0}>
        <Grid item sm={4}>
          <ListItem className="text-center py-0">
            <ListItemText primary="Area" secondary={device.areaName} />
          </ListItem>
        </Grid>
        <Grid item sm={4}>
          <ListItem className="text-center py-0">
            <ListItemText primary="Nama" secondary={device.deviceName} />
          </ListItem>
        </Grid>
        <Grid item sm={4}>
          <ListItem className="text-center py-0">
            <ListItemText primary="Serial Number" secondary={device.deviceSn} />
          </ListItem>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DeviceCard;
