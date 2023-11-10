import { TextField, TextFieldProps } from "@material-ui/core";
import { FieldCreatorEventHandler } from "@mid/helper/fieldCreator.helper";
import { omitFormsyProps } from "app/helper/formsy.helper";
import { withFormsy } from "formsy-react";
import { WithFormsy } from "interface/formsy";
import debounce from "lodash/debounce";
import React from "react";

interface Props extends WithFormsy<TextFieldProps> {
  onChange?: FieldCreatorEventHandler;
}

const TextFieldFormsy: React.ForwardRefRenderFunction<any, Props> = (
  props: Props,
  ref: React.Ref<any>,
): JSX.Element => {
  const importedProps = omitFormsyProps<Props>(props);

  const changeValueDebounce = React.useCallback(
    debounce((event: React.ChangeEvent<{ value: unknown }>) => {
      props.onChange!(event);
    }, 250),
    [],
  );

  function changeValue(event: React.ChangeEvent<{ value: unknown }>) {
    props.setValue(event.target.value);
    if (props.onChange) {
      if (props.debounce) {
        changeValueDebounce(event);
      } else {
        props.onChange!(event);
      }
    }
  }

  function getHelperText() {
    if (!props.isPristine) {
      let message = props.errorMessage ?? props.errorMessages.join(", ") ?? "";
      message += "\n" + (props.helperText ?? "");

      return message.trim();
    }
    return props.helperText ?? "";
  }

  return (
    <TextField
      autoComplete="off"
      fullWidth
      {...importedProps}
      onChange={changeValue}
      value={props.value ?? ""}
      error={!props.isPristine ? props.errorMessage != null ?? props.errorMessages.length == 0 : false}
      disabled={props.isFormDisabled || props.disabled}
      required={props.required ?? props.isRequired}
      helperText={getHelperText()}
    />
  );
};

export default React.memo(withFormsy(React.forwardRef(TextFieldFormsy)));
