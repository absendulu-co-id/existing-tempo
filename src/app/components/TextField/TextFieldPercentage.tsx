import { TextField, TextFieldProps } from "@material-ui/core";
import { MaskedInputOnChange } from "interface/masked-input-changed";
import React from "react";
import { IMaskInput } from "react-imask";

interface CustomProps {
  onChange: MaskedInputOnChange;
  name: string;
}

export type TextFieldPercentageProps = TextFieldProps & CustomProps;

const _TextMaskPercentage: React.ForwardRefRenderFunction<HTMLTextAreaElement | HTMLInputElement, CustomProps> = (
  props,
  ref,
) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={[
        {
          mask: "num%",
          lazy: false,
          blocks: {
            num: {
              mask: Number,
              scale: 2,
              max: 100,
              radix: ",",
              mapToRadix: ["."],
              signed: false,
            },
          },
        },
      ]}
      scale={2}
      inputRef={ref}
      unmask={false}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
    />
  );
};

const TextMaskPercentage = React.forwardRef<HTMLTextAreaElement | HTMLInputElement, CustomProps>(_TextMaskPercentage);

const _TextFieldPercentage: React.ForwardRefRenderFunction<any, TextFieldPercentageProps> = (
  props,
  ref: React.Ref<any>,
) => {
  const value = props.value == 0 ? "" : props.value;

  return (
    <TextField
      {...props}
      ref={ref}
      inputProps={{ style: { textAlign: "right" } }}
      InputProps={{
        inputComponent: TextMaskPercentage as any,
        ...props.InputProps,
      }}
      InputLabelProps={{ shrink: true }}
      value={value}
    />
  );
};

export const TextFieldPercentage = React.memo(React.forwardRef(_TextFieldPercentage));
