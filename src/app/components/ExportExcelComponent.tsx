import { MyColumn } from "./MyMaterialTable";
import { Icon } from "@iconify-icon/react";
import loadable from "@loadable/component";
import { Button, ButtonTypeMap } from "@material-ui/core";
import { DefaultComponentProps } from "@material-ui/core/OverridableComponent";
import React, { useRef, useState } from "react";

export const NewExcelComponent = loadable(async () => /* webpackPrefetch: true */ await import("./NewExcel"));

interface Props<T extends object = any> extends DefaultComponentProps<ButtonTypeMap> {
  columns?: MyColumn<T>[];
  buttonName?: string;
  sheetName?: string;
  filename?: string;
  data: any;
}

const ExportExcelComponent: React.ForwardRefRenderFunction<any, Props> = (props: Props, ref) => {
  const excelFileRef = useRef<any>(null);
  const [download, setDownload] = useState(false);

  const buttonName = props.buttonName ?? "Export";

  return (
    <React.Fragment>
      <Button
        ref={ref}
        variant="contained"
        color="secondary"
        startIcon={<Icon icon="mdi:content-save" />}
        disabled={props.data == null}
        {...props}
        onClick={() => {
          if (!download) {
            setDownload(true);
          } else {
            excelFileRef.current?.handleDownload();
          }
        }}
      >
        {buttonName} Data
      </Button>
      {download && (
        <NewExcelComponent
          ref={excelFileRef}
          data={props.data}
          columns={props.columns}
          filename={props.filename}
          sheetName={props.sheetName}
        />
      )}
    </React.Fragment>
  );
};

export default React.forwardRef(ExportExcelComponent);
