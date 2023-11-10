import { GeneralConfigFieldOption } from "./general-config";
import { BaseTextFieldProps } from "@material-ui/core";
import { ValidationError } from "formsy-react/dist/interfaces";

export interface FieldData extends BaseTextFieldProps {
  name: string;
  label: string;
  search?: boolean;
  validations?: string | any;
  validationErrors?: {
    isExisty?: ValidationError;
    equalsField?: ValidationError;
    minLength?: ValidationError;
    isEmail?: ValidationError;
    isAlphanumeric?: ValidationError;
    [key: string]: ValidationError;
  };
  isDisabledEdit?: boolean;
  option?: GeneralConfigFieldOption[];
}
