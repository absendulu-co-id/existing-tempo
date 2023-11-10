import {
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Select,
  SelectProps,
} from "@material-ui/core";
import { SelectInputProps } from "@material-ui/core/Select/SelectInput";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import React from "react";

interface Props extends Omit<WithFormsy<SelectProps>, "onChange"> {
  onChange?: SelectInputProps["onChange"];
}

const SelectFormsy: React.FC<Props> = (props: Props) => {
  const { onChange, ...tempImportedProps } = props;
  const importedProps = {
    onChange,
    ...omitFormsyProps<Props>(tempImportedProps),
  };

  function input() {
    switch (importedProps.variant) {
      case "outlined":
        return <OutlinedInput labelWidth={(props.label?.length ?? 0) * 8} id={props.name} />;
      case "filled":
        return <FilledInput id={props.name} />;
      default:
    }
  }

  function changeValue(event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) {
    props.setValue(event.target.value);
    if (props.onChange) {
      props.onChange(event, null);
    }
  }

  return (
    <FormControl
      className={props.className}
      required={props.required ?? props.isRequired}
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      disabled={props.isFormDisabled || props.disabled}
      variant={importedProps.variant}
      fullWidth
    >
      {props.label && <InputLabel htmlFor={props.name}>{props.label}</InputLabel>}
      <Select
        fullWidth
        error={props.errorMessage != null ?? props.errorMessages.length == 0}
        input={input()}
        {...importedProps}
        onChange={changeValue}
        required={props.required ?? props.isRequired}
        disabled={props.isFormDisabled || props.disabled}
      />

      {(!props.isValid || props.helperText != null) && (
        <FormHelperText error={props.errorMessage != null ?? props.errorMessages.length == 0}>
          {props.errorMessage ?? props.errorMessages.join(", ")}
          {props.helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default React.memo(withFormsy(SelectFormsy));
