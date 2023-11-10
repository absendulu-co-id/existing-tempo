import { KeyboardDatePicker, KeyboardDatePickerProps } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import React from "react";

interface Props extends Omit<WithFormsy<KeyboardDatePickerProps>, "onChange"> {
  onChange: (date: MaterialUiPickersDate | null, value?: string | null) => void;
}

const DateFormsy: React.FC<Props> = (props: Props) => {
  const importedProps = omitFormsyProps<Props>(props);

  function changeValue(date: MaterialUiPickersDate, value?: string | null | undefined) {
    props.setValue(date);
    if (props.onChange) {
      props.onChange(date, value);
    }
  }

  return (
    <KeyboardDatePicker
      fullWidth
      KeyboardButtonProps={{
        "aria-label": "change date",
      }}
      InputLabelProps={{
        shrink: true,
      }}
      format="DD / MM / yyyy"
      {...importedProps}
      onChange={changeValue}
      value={props.value ?? ""}
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
      helperText={props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText}
    />
  );
};

export default React.memo(withFormsy(DateFormsy));
