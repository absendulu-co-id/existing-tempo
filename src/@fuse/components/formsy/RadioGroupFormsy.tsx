import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  RadioGroup,
  RadioGroupProps,
} from "@material-ui/core";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import React from "react";

interface Props extends WithFormsy<RadioGroupProps & FormControlProps> {}

const RadioGroupFormsy: React.FC<Props> = (props: Props) => {
  const importedProps = omitFormsyProps<Props>(props);

  function changeValue(event, value) {
    props.setValue(value);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl
      className={props.className}
      required={props.required ?? props.isRequired}
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      disabled={props.isFormDisabled || props.disabled}
    >
      {props.label && <FormLabel>{props.label}</FormLabel>}

      <RadioGroup {...importedProps} value={props.value} onChange={changeValue} />

      {(!props.isValid || props.helperText != null) && (
        <FormHelperText error={props.errorMessage != null ?? props.errorMessages.length == 0}>
          {props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default React.memo(withFormsy(RadioGroupFormsy));
