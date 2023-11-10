import clsx from "clsx";
import find from "lodash/find";

export const overtimeTypes = [
  {
    id: 1,
    name: 1,
    color: "bg-blue text-white",
    status: "Normal OT",
  },
  {
    id: 2,
    name: 2,
    color: "bg-orange text-white",
    status: "Weekend OT",
  },
  {
    id: 3,
    name: 3,
    color: "bg-green text-white",
    status: "Holiday OT",
  },
  {
    id: 99,
    name: null,
    color: "bg-red text-white",
    status: "INVALID STATUS",
  },
];

function OvertimeTypeComponent(props) {
  if (props.name) {
    return (
      <div className={clsx("inline text-12 p-4 rounded truncate", find(overtimeTypes, { name: props.name }).color)}>
        {find(overtimeTypes, { name: props.name }).status}
      </div>
    );
  } else {
    return "";
  }
}

export default OvertimeTypeComponent;
