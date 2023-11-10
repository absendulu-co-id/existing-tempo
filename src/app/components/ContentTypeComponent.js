import clsx from "clsx";
import find from "lodash/find";

export const contentTypes = [
  {
    id: 1,
    name: 1,
    color: "bg-green text-white",
    status: "Leave",
  },
  {
    id: 2,
    name: 2,
    color: "bg-green text-white",
    status: "Manual Log",
  },
  {
    id: 3,
    name: 3,
    color: "bg-green text-white",
    status: "Overtime",
  },
  // {
  //   id: 4,
  //   name: 4,
  //   color: "bg-green text-white",
  //   status: "Schedule Adjustment",
  // },
  {
    id: 5,
    name: 5,
    color: "bg-green text-white",
    status: "Training",
  },
];

function ContentTypeComponent(props) {
  if (props.name) {
    return (
      <div className={clsx("inline text-12 p-4 rounded truncate", find(contentTypes, { name: props.name }).color)}>
        {find(contentTypes, { name: props.name }).status}
      </div>
    );
  } else {
    return "";
  }
}

export default ContentTypeComponent;
