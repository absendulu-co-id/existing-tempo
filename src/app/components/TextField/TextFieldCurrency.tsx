import { TextField, TextFieldProps } from "@material-ui/core";
import { MaskedInputOnChange } from "interface/masked-input-changed";
import React from "react";
import { IMaskInput } from "react-imask";

interface CustomProps {
  onChange: MaskedInputOnChange;
  name: string;
}

export type TextFieldCurrencyProps = TextFieldProps & CustomProps;

const _TextMaskCurrency: React.ForwardRefRenderFunction<HTMLInputElement | HTMLTextAreaElement, CustomProps> = (
  props,
  ref,
) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={[
        {
          mask: "Rpnum",
          lazy: false,
          blocks: {
            num: {
              mask: Number, // enable number mask
              scale: 2,
              signed: false,
              thousandsSeparator: ".",
              padFractionalZeros: false,
              normalizeZeros: true,
              radix: ",",
              mapToRadix: ["."],
              lazy: false,
            },
          },
        },
      ]}
      inputRef={ref}
      unmask={true}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
    />
  );
};

const TextMaskCurrency = React.forwardRef<HTMLTextAreaElement | HTMLInputElement, CustomProps>(_TextMaskCurrency);

const _TextFieldCurrency: React.ForwardRefRenderFunction<
  HTMLTextAreaElement | HTMLInputElement,
  TextFieldCurrencyProps
> = (props, ref: React.Ref<any>) => {
  const value = props.value == 0 ? "" : props.value;

  return (
    <TextField
      {...props}
      ref={ref}
      inputProps={{ style: { textAlign: "right" } }}
      InputProps={{
        inputComponent: TextMaskCurrency as any,
        ...props.InputProps,
      }}
      InputLabelProps={{ shrink: true }}
      value={value}
    />
  );
};

export const TextFieldCurrency = React.memo(React.forwardRef(_TextFieldCurrency));
