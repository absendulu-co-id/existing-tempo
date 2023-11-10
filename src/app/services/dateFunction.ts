import moment from "moment";

export const datetimeToIsoString = (datetime: moment.MomentInput, isEndOfDay = false) => {
  const dateLocal = moment(datetime).toDate();
  const date = isEndOfDay
    ? new Date(
        Date.UTC(dateLocal.getUTCFullYear(), dateLocal.getUTCMonth(), dateLocal.getUTCDate(), 23, 59, 59, 59),
      ).toISOString()
    : dateLocal.toISOString();
  return date;
};

export const parseTime = (time?: string) => {
  if (time) {
    const c = time.split(":");
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  } else {
    return "";
  }
};

export const createDateFromTextValue = (value?: string) => {
  if (value) {
    const splitParts = value.split(":");
    return new Date(1970, 1, 1, parseInt(splitParts[0]), parseInt(splitParts[1]));
  }
  return "";
};

export const getDates = (startDate: moment.MomentInput, stopDate: moment.MomentInput) => {
  const dateArray: string[] = [];
  let currentDate = moment(startDate);
  const endDate = moment(stopDate);
  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).startOf("days").format("DD-MM-YYYY"));
    currentDate = moment(currentDate).startOf("days").add(1, "days");
  }
  return dateArray;
};
