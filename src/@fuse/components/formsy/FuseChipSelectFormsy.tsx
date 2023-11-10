import { FuseChipSelect } from "@fuse";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import clsx from "clsx";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import pick from "lodash/pick";
import React from "react";

interface Props extends WithFormsy<any> {}

const FuseChipSelectFormsy: React.FC<Props> = (props: Props) => {
  const importedProps = pick(props, [
    "children",
    "classes",
    "className",
    "defaultValue",
    "disabled",
    "fullWidth",
    "id",
    "label",
    "name",
    "onBlur",
    "onChange",
    "onFocus",
    "placeholder",
    "required",
    "textFieldProps",
    "variant",
    "isMulti",
    "options",
    "errorMessage",
  ]);

  function changeValue(value, selectedOptions) {
    if (props.multiple) {
      props.setValue(selectedOptions.map((option) => option.value));
    } else {
      props.setValue(value);
    }
  }

  return (
    <FormControl
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
      className={clsx(props.className, props.showRequired ? "required" : props.showError ? "error" : null)}
      variant={importedProps.variant}
    >
      {props.label && <InputLabel htmlFor={props.name}>{props.label}</InputLabel>}
      <FuseChipSelect {...importedProps} value={props.value} onChange={changeValue} />

      {(!props.isValid || props.helperText != null) && (
        <FormHelperText error={props.errorMessage != null ?? props.errorMessages.length == 0}>
          {props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default React.memo(withFormsy(FuseChipSelectFormsy));
