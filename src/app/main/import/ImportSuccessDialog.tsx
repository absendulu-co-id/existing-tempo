import { MyMaterialTable } from "@/app/components/MyMaterialTable";
import { useStore } from "@/app/store/store";
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
  Grid,
  LinearProgress,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Import } from "@pt-akses-mandiri-indonesia/ab-api-model-interface";
import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  stateImportData: [Import | null, React.Dispatch<React.SetStateAction<Import | null>>];
}

const _ImportSuccessDialog: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loading = useStore((store) => store.ImportSlice.loading);
  const [stateImportData, setStateImportData] = props.stateImportData;
  const importId = stateImportData?.importId;

  const imports = useStore((store) => store.ImportSlice.imports);
  const importData = imports.find((importData) => importData.importId === importId);

  useEffect(() => {
    if (stateImportData == null) return;
    void useStore.getState().ImportSlice.actions.fetchImports(importData?.importId);

    const interval = setInterval(async () => {
      if (stateImportData == null) return;
      await useStore.getState().ImportSlice.actions.fetchImports(importData?.importId);
    }, 7 * 1000);
    return () => clearInterval(interval);
  }, [stateImportData]);

  if (importId == null) return <></>;

  const handleRetry = async () => {
    await useStore.getState().ImportSlice.actions.importRetry(importData!.importId);
    // setStateImportData(null);
  };

  const handleContinue = async () => {
    await useStore.getState().ImportSlice.actions.importContinue(importData!.importId);
    // setStateImportData(null);
  };

  return (
    <Dialog
      onClose={() => setStateImportData(null)}
      open={importData != null}
      scroll="paper"
      maxWidth="xl"
      fullScreen={fullScreen}
    >
      <LinearProgress style={loading ? undefined : { display: "none" }} />
      <DialogTitle>
        Progress Import {importData?.documentName} {moment(importData?.createdAt).format("L LTS")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {importData?.data && Array.isArray(importData.data) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>Data Preview</AccordionSummary>
              <AccordionDetails>
                <MyMaterialTable
                  data={importData.data}
                  columns={
                    importData.data.length != 0
                      ? Object.keys(importData.data[0])
                          .filter((key) => key !== "id")
                          .map((key) => ({ title: key, field: key }))
                      : []
                  }
                />
              </AccordionDetails>
            </Accordion>
          )}
          {importData?.success && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>Progress</AccordionSummary>
              <AccordionDetails>
                <MyMaterialTable
                  data={importData.success as any[]}
                  columns={[
                    {
                      title: "row",
                      field: "row",
                      render: (data) => parseInt(data.row) + 1,
                    },
                    {
                      title: "primaryKey",
                      field: "primaryKey",
                    },
                    {
                      title: "success",
                      field: "success",
                    },
                    {
                      title: "message",
                      field: "message",
                    },
                  ]}
                />
              </AccordionDetails>
            </Accordion>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={1}>
          <Grid item>
            <Typography variant="caption" component="p">
              Retry = import all error rows and unprocessed rows
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" component="p">
              Continue = import from latest processed row
            </Typography>
          </Grid>
        </Grid>

        <Button onClick={() => handleRetry()} style={{ color: theme.palette.error.main }}>
          Retry
        </Button>
        <Tooltip title="Continue import from latest processed row">
          <Button onClick={() => handleContinue()} color="primary">
            Continue
          </Button>
        </Tooltip>
        <Button onClick={() => setStateImportData(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const ImportSuccessDialog = _ImportSuccessDialog;
