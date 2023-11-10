import { Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText } from "@material-ui/core";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import React from "react";

interface Props extends WithFormsy<CheckboxProps> {}

const CheckboxFormsy: React.ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  props: Props,
  ref: React.Ref<HTMLButtonElement>,
) => {
  const importedProps = omitFormsyProps<Props>(props);

  function changeValue(event) {
    props.setValue(event.target.checked);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      className={props.className}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
    >
      <FormControlLabel
        control={
          <Checkbox
            {...importedProps}
            value={undefined}
            checked={props.checked ?? props.value}
            onChange={changeValue}
            disabled={props.isFormDisabled || props.disabled}
            required={props.required ?? props.isRequired}
          />
        }
        label={props.label}
      />
      {(!props.isValid || props.helperText != null) && (
        <FormHelperText error={props.errorMessage != null ?? props.errorMessages.length == 0}>
          {props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default React.memo(withFormsy(React.forwardRef(CheckboxFormsy)));
