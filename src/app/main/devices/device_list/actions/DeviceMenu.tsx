import { DeviceMenuActionDialog } from "./menu/DeviceMenuActionDialog";
import { DeviceMenuCommandDialog } from "./menu/DeviceMenuCommand";
import { DeviceMenuInfoDialog } from "./menu/DeviceMenuInfoDialog";
import { Icon } from "@iconify-icon/react";
import { Button, ButtonGroup, DialogProps, IconButton, Tooltip, useTheme } from "@material-ui/core";
import BuildIcon from "@material-ui/icons/Build";
import InfoIcon from "@material-ui/icons/Info";
import { Device } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import { RootState } from "app/store";
import { closeDialog, openDialog } from "app/store/actions";
import { updateVar } from "app/store/actions/globalAction";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";

export const dialogDefaultOption: Partial<DialogProps> = {
  scroll: "paper",
  fullWidth: true,
  maxWidth: "sm",
};

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  dataRow: Device;
}

const DeviceMenuDialog: React.FC<Props> = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const deviceMenuActionDialogState = useState<boolean>(false);
  const deviceMenuInfoDialogState = useState<boolean>(false);
  const deviceMenuCommandDialogState = useState<boolean>(false);

  const device = props.dataRow;
  const lastHeartbeat = moment(device.lastHeartbeat);

  return (
    <React.Fragment>
      <Tooltip
        title={(() => {
          if (lastHeartbeat.isValid()) {
            return (
              <span>
                {lastHeartbeat.fromNow()}
                <br />
                {lastHeartbeat.format("lll.ss")}
              </span>
            );
          } else {
            return <span>{t("device_never_connected")}</span>;
          }
        })()}
      >
        <span>
          <IconButton size="small" disabled>
            {lastHeartbeat.isAfter(moment().subtract(3, "minutes")) && (
              <Icon icon="wpf:connected" style={{ color: theme.palette.primary.main }} />
            )}

            {!lastHeartbeat.isAfter(moment().subtract(3, "minutes")) && (
              <Icon icon="wpf:disconnected" style={{ color: theme.palette.error.main }} />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <br />

      <ButtonGroup size="small" className="mt-2">
        <Tooltip title="Action">
          <Button onClick={() => deviceMenuActionDialogState[1](true)} size="small">
            <BuildIcon fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title={t("device_info").toString()}>
          <Button onClick={() => deviceMenuInfoDialogState[1](true)} size="small">
            <InfoIcon fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title={t("device_command").toString()}>
          <Button onClick={() => deviceMenuCommandDialogState[1](true)} size="small">
            <Icon icon="heroicons:command-line-20-solid" />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <DeviceMenuActionDialog device={device} stateDialog={deviceMenuActionDialogState} />
      <DeviceMenuInfoDialog device={device} stateDialog={deviceMenuInfoDialogState} />
      <DeviceMenuCommandDialog device={device} stateDialog={deviceMenuCommandDialogState} />
    </React.Fragment>
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

export default connector(DeviceMenuDialog);
