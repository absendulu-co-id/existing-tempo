import { FormattedNumber } from "react-intl";

export const MyFormattedNumber: typeof FormattedNumber = (props) => {
  const getFraction = () => {
    if (props.style == "currency") return 0;
    if (props.style == "percent") return 2;
    return 0;
  };

  return <FormattedNumber style="currency" currency="IDR" maximumFractionDigits={getFraction()} {...props} />;
};
