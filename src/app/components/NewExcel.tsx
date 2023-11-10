import { MyColumn } from "./MyMaterialTable";
import { overtimeTypes } from "./OvertimeTypeComponent";
import { punchStates } from "./PunchStateComponent";
import * as types from "@mid/components/field/types";
import { dotToObject } from "app/helper/object.helper";
import { converArrayToString } from "app/services/arrayFunction";
import { RootState } from "app/store";
import moment from "moment";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import ReactExport from "react-data-export";
import { renderToStaticMarkup } from "react-dom/server";
import { useSelector } from "react-redux";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

interface Props<T extends object = any> {
  columns?: MyColumn<T>[];
  sheetName?: string;
  filename?: string;
  data: any;
  ref: React.Ref<any>;
}

function stripHtml(html) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  const temporalDivElement = document.createElement("p");
  // eslint-disable-next-line xss/no-mixed-html
  temporalDivElement.innerHTML = textarea.value;
  return temporalDivElement.textContent ?? temporalDivElement.innerText ?? "";
}

const NewExcel: React.ForwardRefRenderFunction<any, Props> = ({ sheetName, data, ...props }, ref) => {
  const column = useSelector(({ formMaker }: RootState) => formMaker.fieldList);
  const columns = props.columns
    ? props.columns.filter((x) => x.field !== "tombolActions")
    : column.filter((x) => x.field !== "tombolActions" && x.allowExport);

  const filename = `${props.filename}-DATA-${moment().format("YYYYMMDD")}`;

  const innerRef = useRef<any>(null);
  useImperativeHandle(ref, () => innerRef.current);

  useEffect(() => {
    innerRef.current.handleDownload();
  }, []);

  return (
    <ExcelFile
      filename={filename}
      element={<span style={{ visibility: "hidden", display: "none" }}></span>}
      ref={innerRef}
    >
      <ExcelSheet data={data} name={sheetName ?? filename}>
        {columns.map((item, index) => {
          item.name ??= item.field ?? "";
          item.label ??= item.title ? renderToStaticMarkup(item.title as any) : "";

          let title = "";
          let value: string | ((col: any) => string | undefined) = "";

          if (item.name === "overtimeType") {
            value = (col) =>
              overtimeTypes.find((item) => item.name === col.overtimeType)
                ? overtimeTypes.find((item) => item.name === col.overtimeType)?.status
                : "";
          } else if (item.name === "punchState") {
            value = (col) =>
              punchStates.find((item) => item.name === col.punchState)
                ? punchStates.find((item) => item.name === col.punchState)?.status
                : "";
          } else {
            title = item.label;
            value = item.name;
          }

          if (item.fieldType === types.TYPE_FIELD_SELECT) {
            if (item.dataSource === "CUSTOM") {
              value = (col) =>
                item.option?.find((newItem) => newItem.value === col[item.name])
                  ? item.option.find((newItem) => newItem.value === col[item.name])?.label
                  : "";
            } else if (item.name == "areaIdAreas") {
              value = (col) => col.areaIdAreas?.map((x) => x.areaName).join(", ");
            }
          } else if (item.fieldType === types.TYPE_FIELD_DATE) {
            value = (col) => (col[item.name] != null ? moment(col[item.name]).format("YYYY-MM-DD") : "");
          } else if (item.fieldType === types.TYPE_FIELD_DATETIME) {
            value = (col) => (col[item.name] != null ? moment(col[item.name]).format("YYYY-MM-DD HH:mm") : "");
          }

          switch (item.type ?? item.xlsType) {
            case "render":
              value = item.renderXls ?? "";
              if (value == "" && item.render != null) {
                const rendered = stripHtml(renderToStaticMarkup(item.render(data)));
                value = () => rendered;
              }
              break;
            case "unix":
              value = (col) => (col[item.name] != null ? moment(col[item.name]).format("YYYY-MM-DD HH:mm") : "");
              break;
            case "unixminute":
              value = (col) => (col[item.name] != null ? moment(col[item.name]).format("YYYY-MM-DD HH:mm") : "");
              break;
            case "unixtime":
              value = (col) => (col[item.name] != null ? moment(col[item.name]).format("YYYY-MM-DD HH:mm:ss") : "");
              break;
            case "time":
              value = (col) => (col[item.name] != null ? moment(col[item.name]).format("LTS") : "");
              break;
            case "date":
              value = (col) => (col[item.name] != null ? moment(col[item.name]).format("L") : "");
              break;
            case "voidStatusCustom":
              value = (col) => (col[item.name] > 0 ? "Ya" : "Tidak");
              break;
            case "customObject":
              value = (col) => (item.name != null ? dotToObject(col)[item.name] : "");
              break;
            case "arrayToString":
              value = (col) => (item.name != null ? converArrayToString(col[item.name], item.arrayField!) : "");
              break;
            case "location":
              value = (col) => `${col.locationAddress} ( lat: ${col.latitude}, long: ${col.longitude})`;
              break;
            case "boolean":
              value = (col) => (col[item.name] != null ? "Ya" : "Tidak");
              break;
          }

          if (value == "") {
            value = item.renderXls ?? "";
            if (value == "" && item.render != null) {
              const rendered = stripHtml(renderToStaticMarkup(item.render(data)));
              value = () => rendered;
            }
          }

          return <ExcelColumn key={index} label={title} value={value} />;
        })}
      </ExcelSheet>
    </ExcelFile>
  );
};
export default React.forwardRef(NewExcel);
