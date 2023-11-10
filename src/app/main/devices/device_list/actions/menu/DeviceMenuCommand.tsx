import { FuseLoading } from "@/@fuse";
import { MyMaterialTable } from "@/app/components/MyMaterialTable";
import { DeviceCommandSummary, RootObjectPagination } from "@/interface";
import {
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
import { Device, Devicecommand } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import Axios from "axios";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface Props {
  device: Device;
  stateDialog: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const _DeviceMenuCommandDialog: React.FC<Props> = ({ device, ...props }) => {
  const [open, setOpen] = props.stateDialog;
  const theme = useTheme();
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [commands, setCommands] = useState<RootObjectPagination<Devicecommand> | null>(null);
  const [commandSummary, setCommandSummary] = useState<DeviceCommandSummary | null>(null);

  const getCommandSummary = async () => {
    try {
      const res = await Axios.get<DeviceCommandSummary>(`/device/command-summary/${device.deviceId}`);
      setCommandSummary(res.data);
    } catch (error: any) {
      await Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const getCommands = async (page: number | null, pageSize: number | null = 10) => {
    try {
      const res = await Axios.get<RootObjectPagination<Devicecommand>>(`/device/command/${device.deviceId}`, {
        params: {
          page: page ?? commands?.current_page,
          per_page: pageSize ?? commands?.per_page,
          order_by: undefined,
        },
      });

      setCommands(res.data);
    } catch (error: any) {
      await Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (open) {
      void getCommandSummary();
      void getCommands(1);
    }
  }, [device, open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen} scroll="paper" fullWidth maxWidth="lg">
      <DialogTitle>{t("device_command")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container justifyContent="center">
            <Grid item sm={12} md={4}>
              <List dense>
                {commandSummary == null && <FuseLoading />}
                {commandSummary != null &&
                  Object.keys(commandSummary).map((key, i) => {
                    return (
                      <React.Fragment key={"deviceCommandSummary" + i}>
                        <ListItem>
                          <Grid container justifyContent="space-between">
                            <Grid item>{t(key.toSnakeCase())}</Grid>
                            <Grid item>
                              <Typography component="span" variant="body2" color="textPrimary" className="text-right">
                                {(() => {
                                  if (["lastCommandExecuted"].includes(key) && moment(commandSummary[key]).isValid()) {
                                    return (
                                      <>
                                        <Typography variant="body1">{moment(commandSummary[key]).fromNow()}</Typography>
                                        <Typography variant="caption">
                                          {moment(commandSummary[key]).format("L LTS")}
                                        </Typography>
                                      </>
                                    );
                                  } else {
                                    return commandSummary[key];
                                  }
                                })()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </ListItem>
                        <Divider component="li" className="" />
                      </React.Fragment>
                    );
                  })}
              </List>
            </Grid>
          </Grid>
          {commands == null && <FuseLoading />}
          {commands != null && (
            <MyMaterialTable<Devicecommand>
              data={commands.data}
              totalCount={commands.total}
              onPageChangeCustom={getCommands}
              page={commands.current_page}
              pageSize={commands.per_page}
              columns={[
                {
                  field: "commandlogId",
                  title: "ID",
                },
                {
                  field: "cmd",
                  title: "Command",
                },
                {
                  field: "reply",
                  title: "Reply",
                },
                {
                  field: "createdAt",
                  title: "createdAt",
                  render: (rowData) => moment(rowData.createdAt).format("L LTS"),
                },
                {
                  field: "updatedAt",
                  title: "updatedAt",
                  render: (rowData) => moment(rowData.updatedAt).format("L LTS"),
                },
              ]}
            />
          )}
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

export const DeviceMenuCommandDialog = _DeviceMenuCommandDialog;
