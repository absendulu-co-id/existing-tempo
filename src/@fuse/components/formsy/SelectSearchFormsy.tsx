import {
  FilledInput,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from "@material-ui/core";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import pick from "lodash/pick";
import React from "react";

interface Props extends WithFormsy<SelectProps> {
  options: any[];
  optionValue: string;
  optionLabel: string | symbol;
}

const SelectSearchFormsy: React.FC<Props> = (props: Props) => {
  const importedProps = pick(props, [
    "id",
    "name",
    "autoWidth",
    "children",
    "classes",
    "displayEmpty",
    "input",
    "inputProps",
    "MenuProps",
    "multiple",
    "native",
    "onChange",
    "onClose",
    "onOpen",
    "open",
    "renderValue",
    "SelectDisplayProps",
    "value",
    "variant",
    "fullWidth",
    "isSearchable",
    "optionLabel",
    "optionValue",
    "options",
    "placeholder",
    "styles",
    "isDisabled",
    "isClearable",
    "isOptionSelected",
    "isMulti",
    "required",
    "label",
    "disabled",
  ]);

  importedProps.variant ??= "outlined";

  function input() {
    switch (importedProps.variant) {
      case "outlined":
        return <OutlinedInput labelWidth={props.label?.length ?? 0 * 8} id={props.name} />;
      case "filled":
        return <FilledInput id={props.name} />;
      default:
        return <Input id={props.name} />;
    }
  }

  function changeValue(event) {
    props.setValue(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  }
  return (
    <FormControl
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      className={props.className}
      variant={importedProps.variant}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
      fullWidth
    >
      {props.label && <InputLabel htmlFor={props.name}>{props.label}</InputLabel>}
      <Select
        input={input()}
        {...importedProps}
        name={importedProps.name}
        value={props.value}
        onChange={changeValue}
        error={props.errorMessage != null ?? props.errorMessages.length == 0}
        required={props.required ?? props.isRequired}
        disabled={props.isFormDisabled || props.disabled}
      >
        {importedProps.options?.map((x, i) => (
          <MenuItem key={i} value={x[importedProps.optionValue!]}>
            {x[importedProps.optionLabel!]}
          </MenuItem>
        ))}
      </Select>

      {(!props.isValid || props.helperText != null) && (
        <FormHelperText error={props.errorMessage != null ?? props.errorMessages.length == 0}>
          props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default React.memo(withFormsy(SelectSearchFormsy));

// <Select
//   {...importedProps}
//   label={importedProps.placeholder}
//   value={value}
//   reactSelectProps={{
//     getOptionValue: importedProps.getOptionValue,
//     getOptionLabel: importedProps.getOptionLabel,
//     isOptionSelected: importedProps.isOptionSelected,
//     isSearchable: importedProps.isSearchable,
//     isClearable: importedProps.isClearable,
//     isLoading: importedProps.isLoading,
//     isDisabled: importedProps.isDisabled,
//     isMulti: importedProps.isMulti,
//     required: importedProps.required,
//   }}
//   size="large"
//   fullWidth
// />;
