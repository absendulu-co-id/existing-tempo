import { Button, Icon } from "@material-ui/core";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const dataSet1 = [
  {
    name: "Johson",
    amount: 30000,
    sex: "M",
    is_married: true,
  },
  {
    name: "Monika",
    amount: 355000,
    sex: "F",
    is_married: false,
  },
  {
    name: "John",
    amount: 250000,
    sex: "M",
    is_married: false,
  },
  {
    name: "Josef",
    amount: 450500,
    sex: "M",
    is_married: true,
  },
];

function SampleImportExcel(props) {
  return (
    <ExcelFile
      element={
        <Button
          variant="contained"
          color="secondary"
          style={{
            backgroundColor: "#3209a3",
            color: "white",
            marginBottom: "2%",
            marginLeft: "1%",
          }}
        >
          <Icon className="text-20">save</Icon>&nbsp;
          {"Contoh Import Data"}
        </Button>
      }
    >
      <ExcelSheet data={dataSet1} name="Employees">
        <ExcelColumn label="Name" value="name" />
        <ExcelColumn label="Wallet Money" value="amount" />
        <ExcelColumn label="Gender" value="sex" />
        <ExcelColumn label="Marital Status" value={(col) => (col.is_married ? "Married" : "Single")} />
      </ExcelSheet>
    </ExcelFile>
  );
}

export default SampleImportExcel;
