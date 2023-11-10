import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Device } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  device: Device;
  stateDialog: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const filteredDeviceOption = ["IPAddress"];

const _DeviceMenuInfoDialog: React.FC<Props> = ({ device, ...props }) => {
  const [open, setOpen] = props.stateDialog;
  const theme = useTheme();
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen} scroll="paper" fullWidth>
      <DialogTitle>{t("device_info")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <List dense>
            {Object.keys(device.deviceOption ?? {})
              .filter((key) => !filteredDeviceOption.includes(key))
              .map((key, i) => {
                return (
                  <React.Fragment key={"deviceOption" + i}>
                    <ListItem>
                      <Grid container justifyContent="space-between">
                        <Grid item>{key}</Grid>
                        <Grid item>
                          <Typography component="span" variant="body2" color="textPrimary" className="text-right">
                            {device.deviceOption![key]}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider component="li" className="" />
                  </React.Fragment>
                );
              })}
          </List>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>More Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense className="w-full">
                {Object.keys(device ?? {})
                  .filter((key) => !["deviceOption", "id", "tableData"].includes(key))
                  .map((key, i) => {
                    return (
                      <React.Fragment key={"device" + i}>
                        <ListItem>
                          <Grid container justifyContent="space-between">
                            <Grid item>{key}</Grid>
                            <Grid item>
                              <Typography component="span" variant="body2" color="textPrimary" className="text-right">
                                {device![key]}
                              </Typography>
                            </Grid>
                          </Grid>
                        </ListItem>
                        <Divider component="li" className="" />
                      </React.Fragment>
                    );
                  })}
              </List>
            </AccordionDetails>
          </Accordion>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DeviceMenuInfoDialog = _DeviceMenuInfoDialog;
