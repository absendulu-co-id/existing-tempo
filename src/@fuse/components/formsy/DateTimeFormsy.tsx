import { KeyboardDateTimePicker, KeyboardDateTimePickerProps } from "@material-ui/pickers";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import React from "react";

interface Props extends WithFormsy<KeyboardDateTimePickerProps> {}

const DateTimeFormsy: React.FC<Props> = (props: Props) => {
  const importedProps = omitFormsyProps<Props>(props);

  function changeValue(event) {
    props.setValue(event);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <KeyboardDateTimePicker
      fullWidth
      KeyboardButtonProps={{
        "aria-label": "change date",
      }}
      InputLabelProps={{
        shrink: true,
      }}
      {...importedProps}
      onChange={changeValue}
      value={props.value ?? ""}
      format="DD/MM/YYYY HH:mm"
      ampm={false}
      inputVariant="outlined"
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
      helperText={props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText}
    />
  );
};

export default React.memo(withFormsy(DateTimeFormsy));
