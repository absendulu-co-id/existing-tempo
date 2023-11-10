import clsx from "clsx";
import find from "lodash/find";

export const orderStatuses = [
  {
    id: 1,
    name: 1,
    color: "bg-blue text-white",
    status: "New Transaction",
  },
  {
    id: 2,
    name: 2,
    color: "bg-orange text-white",
    status: "Payment Received",
  },
  {
    id: 3,
    name: 3,
    color: "bg-green text-white",
    status: "Tenant Accept",
  },
  {
    id: 4,
    name: 4,
    color: "bg-orange text-white",
    status: "Tenant Reject",
  },
  {
    id: 5,
    name: 5,
    color: "bg-red text-white",
    status: "Payment Expired / Failed",
  },
  {
    id: 6,
    name: 6,
    color: "bg-yellow text-black",
    status: "Order sedang disiapkan",
  },
  {
    id: 7,
    name: 7,
    color: "bg-blue text-white",
    status: "Order telah siap",
  },
  {
    id: 8,
    name: 8,
    color: "bg-green text-white",
    status: "Order Selesai",
  },

  {
    id: 9,
    name: 9,
    color: "bg-red text-white",
    status: "Reject by System",
  },
  {
    id: 10,
    name: 10,
    color: "bg-purple text-white",
    status: "Refund",
  },
  {
    id: 11,
    name: "DRAFT",
    color: "bg-yellow text-black",
    status: "Draft",
  },
  {
    id: 12,
    name: "APPROVED",
    color: "bg-green text-white",
    status: "Approved",
  },
  {
    id: 99,
    name: null,
    color: "bg-red text-white",
    status: "INVALID STATUS",
  },
];

function StatusComponent(props) {
  return (
    <div className={clsx("inline text-12 p-4 rounded truncate", find(orderStatuses, { name: props.name }).color)}>
      {find(orderStatuses, { name: props.name }).status}
    </div>
  );
}

export default StatusComponent;
