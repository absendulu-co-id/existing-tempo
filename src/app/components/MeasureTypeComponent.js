import clsx from "clsx";
import find from "lodash/find";

export const measureTypes = [
  {
    id: 1,
    name: 1,
    color: "bg-blue text-white",
    status: "Menit",
  },
  {
    id: 2,
    name: 2,
    color: "bg-orange text-white",
    status: "Jam",
  },
  {
    id: 3,
    name: 3,
    color: "bg-green text-white",
    status: "Hari Kerja",
  },
  {
    id: 4,
    name: 4,
    color: "bg-green text-white",
    status: "HH:MM",
  },
  {
    id: 99,
    name: null,
    color: "bg-red text-white",
    status: "INVALID STATUS",
  },
];

function MeasureTypeComponent(props) {
  if (props.name) {
    return (
      <div className={clsx("inline text-12 p-4 rounded truncate", find(measureTypes, { name: props.name }).color)}>
        {find(measureTypes, { name: props.name }).status}
      </div>
    );
  } else {
    return "";
  }
}

export default MeasureTypeComponent;
