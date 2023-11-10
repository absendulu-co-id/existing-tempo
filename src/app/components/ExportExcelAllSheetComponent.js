// import React from "react";
// import { Button, Icon } from "@material-ui/core";
// import * as moment from "moment";
// import ReactExport from "react-export-excel";
// import { formatterRupiah } from "app/services/numberFunction";
// import _ from "lodash";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

// function ExportExcelAllSheetComponent(props) {
//   const columns = props.columns.filter(
//     (item) => item.field !== "tombolActions"
//   );
//   const buttonName =
//     props.type === "Failed" ? "Download Failed Import" : "Export";
//   let arrayData = props.data;
//   return (
//     <ExcelFile
//       filename={`${props.filename}-DATA-${moment().format("YYYYMMDD")}`}
//       element={
//         <Button variant="contained" color="secondary" style={props.style}>
//           <Icon className="text-20">save</Icon>
//           {` ${buttonName} Data`}
//         </Button>
//       }
//     >
//       {arrayData.map((mainItem, mainIndex) => {
//         const sheetName = mainItem.tenantName.replace(/["']/g, "");
//         let multiDataValue = [];
//         let multiColumn = columns.map((item) => item.title);
//         mainItem.tenantData.map((item) => {
//           let tmpData = [];
//           columns.map((subItem) => {
//             if (subItem.field === "transactionTime") {
//               tmpData.push(
//                 moment.unix(item[subItem.field]).format("YYYY-MM-DD")
//               );
//             } else if (subItem.field === "tenantName") {
//               tmpData.push(item[subItem.field].replace(/["']/g, ""));
//             } else {
//               tmpData.push(item[subItem.field]);
//             }
//           });
//           multiDataValue.push(tmpData);
//         });

//         multiDataValue.push([
//           "",
//           {
//             value: "Total",
//             style: {
//               font: { bold: true },
//             },
//           },
//           _.sumBy(mainItem.tenantData, "grandTotal"),
//           _.sumBy(mainItem.tenantData, "tax"),
//           _.sumBy(mainItem.tenantData, "totalNetPrice"),
//           _.sumBy(mainItem.tenantData, "profitSharing"),
//           _.sumBy(mainItem.tenantData, "mgtFees"),
//           _.sumBy(mainItem.tenantData, "paid"),
//         ]);

//         const columnSummaryData = props.dataSummary.find(
//           (subItem) => subItem.tenantName === mainItem.tenantName
//         );
//         const multiColumnSummary = props.columnSummary.map(
//           (item) => item.title
//         );
//         let multiDataSummaryValue = [];

//         columnSummaryData.tenantData.map((item) => {
//           let tmpData = [];
//           props.columnSummary.map((subItem) => {
//             if (subItem.field === "transactionTime") {
//               tmpData.push(
//                 moment.unix(item[subItem.field]).format("YYYY-MM-DD")
//               );
//             } else if (subItem.field === "tenantName") {
//               tmpData.push(item[subItem.field].replace(/["']/g, ""));
//             } else {
//               tmpData.push(item[subItem.field]);
//             }
//           });
//           multiDataSummaryValue.push(tmpData);
//         });
//         multiDataSummaryValue.push([
//           {
//             value: "Total",
//             style: {
//               font: { bold: true },
//             },
//           },
//           _.sumBy(columnSummaryData.tenantData, "sales"),
//           _.sumBy(columnSummaryData.tenantData, "totalElectricity"),
//           _.sumBy(columnSummaryData.tenantData, "totalWater"),
//           _.sumBy(columnSummaryData.tenantData, "totalGas"),
//           _.sumBy(columnSummaryData.tenantData, "paid"),
//         ]);

//         window["multiDataSet" + mainIndex] = [
//           {
//             columns: ["Ringkasan"],
//             data: [],
//           },
//           {
//             columns: multiColumnSummary,
//             data: multiDataSummaryValue,
//           },
//           {
//             ySteps: 4,
//             columns: ["Lampiran"],
//             data: [],
//           },
//           {
//             columns: multiColumn,
//             data: multiDataValue,
//           },
//         ];
//         return (
//           <ExcelSheet
//             dataSet={window["multiDataSet" + mainIndex]}
//             name={sheetName}
//             key={mainIndex}
//           />
//         );
//       })}
//     </ExcelFile>
//   );
// }

// export default ExportExcelAllSheetComponent;
