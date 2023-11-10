import DeviceCard from "../DeviceCard";
import * as Actions from "app/store/actions";
import { dialogDefaultOption } from "../DeviceMenu";
import { RootState } from "@/app/store";
import { closeDialog, openDialog } from "@/app/store/actions";
import { updateVar } from "@/app/store/actions/globalAction";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AssessmentIcon from "@material-ui/icons/Assessment";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import { Device } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import axios from "axios";
import React from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  device: Device;
  stateDialog: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const _DeviceMenuActionDialog: React.FC<Props> = ({ device, ...props }) => {
  const [open, setOpen] = props.stateDialog;
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const openDialogPleaseWait = () => {
    props.openDialog({
      ...dialogDefaultOption,
      fullScreen,
      onClose: () => {
        return false;
      },
      children: (
        <React.Fragment>
          <DialogTitle>Silahkan tunggu...</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <CircularProgress></CircularProgress>
              </div>
            </DialogContentText>
          </DialogContent>
        </React.Fragment>
      ),
    });
  };

  const openDialogSuccess = (p: { content: string; title?: string }) => {
    const title = p.title ?? "Berhasil!";
    const content = p.content;

    props.openDialog({
      ...dialogDefaultOption,
      fullScreen,
      onClose: () => {
        return false;
      },
      children: (
        <React.Fragment>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{content}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.closeDialog();
              }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </React.Fragment>
      ),
    });
  };

  const openDialogError = (err: any) => {
    props.openDialog({
      ...dialogDefaultOption,
      fullScreen,
      onClose: () => {
        return false;
      },
      children: (
        <React.Fragment>
          <DialogTitle>Gagal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Maaf, terjadi kesalahan dalam proses upload!
              <pre>{JSON.stringify(err, null, 2)}</pre>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.closeDialog();
              }}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </React.Fragment>
      ),
    });
  };

  const openDialogConfirmation = (p: { action: string; onConfirm: () => void }) => {
    props.openDialog({
      ...dialogDefaultOption,
      onClose: () => {
        return false;
      },
      fullScreen,
      children: (
        <React.Fragment>
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent className="text-center">
            <DeviceCard device={device} className="mb-16" />
            Apakah Anda yakin untuk {p.action} pada mesin ini?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.closeDialog();
              }}
            >
              Batal
            </Button>
            <Button onClick={p.onConfirm} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </React.Fragment>
      ),
    });
  };

  const uploadEmployee = async () => {
    openDialogPleaseWait();
    try {
      await axios.post("/device-upload-user", [device]);

      openDialogSuccess({
        content: "Upload data karyawan berhasil!",
      });
    } catch (err) {
      openDialogError(err);
    }
  };

  const downloadEmployeeNew = async (id: any) => {
    try {
      const res = await axios.request({
        method: 'POST',
        url: `/device-download-user/${id}`,
      })
      console.log('res download employee', res);
      if (res.status === 200) {
        dispatch(Actions.showMessage({
          message: "Download dari perangkat berhasil !", // text or html
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
          variant: "info", // success
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openDialogDownloadEmployeeMenu = () => {
    props.openDialog({
      ...dialogDefaultOption,
      fullScreen,
      onClose: () => {
        return false;
      },
      children: (
        <React.Fragment>
          <DialogTitle>Download dari perangkat</DialogTitle>
          <DialogContent>
            <DeviceCard device={device} />

            <ListItem
              button
              onClick={() =>
                openDialogConfirmation({
                  action: "download dari perangkat dengan ID karyawan dari laporan transaksi",
                  onConfirm: downloadEmployeeFromTransaction,
                })
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <AssessmentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Dari laporan transaksi perangkat"
                secondary="ID karyawan diambil dari laporan transaksi perangkat yang sudah ada di Absendulu"
              />
            </ListItem>

            <ListItem button onClick={() => openDialogDownloadEmployeeManual()}>
              <ListItemAvatar>
                <Avatar>
                  <EditIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Masukkan ID karyawan" secondary="ID karyawan dimasukkan manual" />
            </ListItem>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                props.closeDialog();
              }}
            >
              Batal
            </Button>
          </DialogActions>
        </React.Fragment>
      ),
    });
  };

  const openDialogDownloadEmployeeManual = () => {
    props.openDialog({
      ...dialogDefaultOption,
      fullScreen,
      onClose: () => {
        return false;
      },
      children: (
        <React.Fragment>
          <form onSubmit={handleSubmitDialogDownloadEmployeeManual}>
            <DialogTitle>Download dari perangkat ID karyawan</DialogTitle>
            <DialogContent>
              <DeviceCard device={device} />
              <Typography gutterBottom className="my-16">
                Masukkan ID karyawan dibawah ini, dipisahkan dengan baris
              </Typography>

              <Accordion className="my-16">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Contoh</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="ID Karyawan"
                    multiline
                    minRows={4}
                    maxRows={4}
                    variant="outlined"
                    fullWidth
                    disabled
                    defaultValue={"1\n2\n3\n"}
                  />
                </AccordionDetails>
              </Accordion>

              <TextField
                label="ID Karyawan"
                multiline
                minRows={3}
                maxRows={20}
                variant="outlined"
                fullWidth
                name="employeeId"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  props.closeDialog();
                }}
              >
                Batal
              </Button>
              <Button type="submit" color="primary">
                OK
              </Button>
            </DialogActions>
          </form>
        </React.Fragment>
      ),
    });
  };

  const handleSubmitDialogDownloadEmployeeManual = async (e) => {
    e.preventDefault();
    const inputEmployeeId = e.target.elements.employeeId.value as string;
    const employeeIds = inputEmployeeId
      .trim()
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x != "");
    await downloadEmployeeManual(employeeIds);
  };

  const downloadEmployeeManual = async (employeeIds: string[]) => {
    openDialogPleaseWait();
    try {
      await axios.post("/device-download-user", {
        ...device,
        employeeId: employeeIds,
      });

      openDialogSuccess({
        content: "Download data karyawan berhasil!",
      });
    } catch (err) {
      openDialogError(err);
    }
  };

  const restartDevice = async () => {
    openDialogPleaseWait();
    try {
      await axios.post("/device-reboot", [device]);

      openDialogSuccess({
        content: "Restart perangkat berhasil dikirim!",
      });
    } catch (err) {
      openDialogError(err);
    }
  };

  const downloadEmployeeFromTransaction = async () => {
    openDialogPleaseWait();
    try {
      await axios.post("/device-download-user", {
        ...device,
        employeeIdFromAttendance: true,
      });

      openDialogSuccess({
        content: "Download data karyawan berhasil!",
      });
    } catch (err) {
      openDialogError(err);
    }
  };

  console.log('device ryujin', device);

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={() => setOpen(false)} scroll="paper" fullWidth maxWidth="sm">
      <DialogTitle>Action Perangkat</DialogTitle>

      <DialogContent>
        <DeviceCard device={device} />

        <ListSubheader>Data Karyawan</ListSubheader>

        {/* Activate code below, kalo mau munculin upload device (per device satu-satu) */}
        <ListItem
          button
          onClick={() => {
            setOpen(false);
            openDialogConfirmation({
              action: "upload karyawan",
              onConfirm: uploadEmployee,
            });
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <PublishIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Upload ke perangkat" secondary="Data karyawan Absendulu akan dikirim ke perangkat" />
        </ListItem>

        <ListItem
          button
          onClick={() => downloadEmployeeNew(device.deviceId)}
        >
          <ListItemAvatar>
            <Avatar>
              <GetAppIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Download dari perangkat"
            secondary="Data karyawan dari perangkat dikirim ke Absendulu"
          />
        </ListItem>

        <ListSubheader>Lain-lain</ListSubheader>

        <ListItem
          button
          onClick={() => {
            setOpen(false);
            openDialogConfirmation({
              action: "restart perangkat",
              onConfirm: restartDevice,
            });
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <GetAppIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Restart Perangkat" />
        </ListItem>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} autoFocus>
          Batal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    status: state.globalReducer.status,
  };
};

const mapDispatchToProps = {
  updateVar,
  closeDialog,
  openDialog,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const DeviceMenuActionDialog = connector(_DeviceMenuActionDialog);
