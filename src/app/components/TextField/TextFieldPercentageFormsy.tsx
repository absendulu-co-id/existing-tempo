import { TextFieldCurrencyProps } from "./TextFieldCurrency";
import { TextFieldPercentage } from "./TextFieldPercentage";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface";
import debounce from "lodash/debounce";
import React, { useEffect } from "react";

interface Props extends WithFormsy<Omit<TextFieldCurrencyProps, "onChange">> {}

const TextFieldCurrencyFormsy = React.forwardRef((props: Props, ref: React.Ref<any>): JSX.Element => {
  const importedProps = omitFormsyProps<Props>(props);

  useEffect(() => {
    if (typeof props.value === "string" || props.value === 0) {
      if (props.value == "0") {
        props.setValue("", false);
      } else {
        props.setValue(props.value.toString(), false);
      }
    }
  }, [props.value]);

  const changeValueDebounce = React.useCallback(
    debounce((event: React.ChangeEvent<{ value: unknown }>) => {
      props.onChange!(event);
    }, 250),
    [],
  );

  function changeValue(event: React.ChangeEvent<{ value: unknown }>) {
    props.setValue((event.target.value as any).toString(), true);
    if (props.onChange) {
      if (props.debounce) {
        changeValueDebounce(event);
      } else {
        props.onChange!(event);
      }
    }
  }

  return (
    <TextFieldPercentage
      autoComplete="off"
      fullWidth
      {...importedProps}
      onChange={changeValue as any}
      value={props.value ?? ""}
      error={props.errorMessage != null ?? props.errorMessages.length == 0}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
      helperText={props.errorMessage ?? props.errorMessages.join(", ") ?? props.helperText}
    />
  );
});

export default React.memo(withFormsy(TextFieldCurrencyFormsy));
