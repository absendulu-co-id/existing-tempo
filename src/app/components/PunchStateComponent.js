import clsx from "clsx";

export const punchStates = [
  {
    id: 1,
    name: 1,
    color: "bg-green text-white",
    status: "Check In",
  },
  {
    id: 2,
    name: 2,
    color: "bg-green text-white",
    status: "Check Out",
  },
  {
    id: 3,
    name: 3,
    color: "bg-green text-white",
    status: "Break Out",
  },
  {
    id: 4,
    name: 4,
    color: "bg-green text-white",
    status: "Break In",
  },
  {
    id: 5,
    name: 5,
    color: "bg-green text-white",
    status: "Overtime In",
  },
  {
    id: 6,
    name: 6,
    color: "bg-green text-white",
    status: "Overtime Out",
  },
  {
    id: 7,
    name: 7,
    color: "bg-green text-white",
    status: "No Status",
  },
];

function PunchStateComponent(props) {
  if (props.name) {
    return (
      <div className={clsx("inline text-12 p-4 rounded truncate", find(punchStates, { name: props.name }).color)}>
        {find(punchStates, { name: props.name }).status}
      </div>
    );
  } else {
    return "";
  }
}

export default PunchStateComponent;
