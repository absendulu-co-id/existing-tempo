import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Fragment } from "react";

function TableReportComponent(props) {
  return (
    <Fragment>
      <h2 style={{ marginTop: "2%", marginBottom: "1%" }}>{props.title}</h2>
      <Table>
        <TableHead>
          <TableRow>
            {props.columns.map((item, index) => {
              return <TableCell key={index}>{item.title}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.length > 0 ? (
            props.data.map((item, index) => {
              return (
                <TableRow key={index}>
                  {props.columns.map((subItem, subIndex) => {
                    const field = subItem.field;
                    return <TableCell key={subIndex}>{item[field]}</TableCell>;
                  })}
                </TableRow>
              );
            })
          ) : (
            <Fragment>
              <TableRow style={{ height: 53 }}>
                <TableCell colSpan={3}>
                  <center>Tidak ada data ditampilkan</center>
                </TableCell>
              </TableRow>
            </Fragment>
          )}
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default TableReportComponent;
