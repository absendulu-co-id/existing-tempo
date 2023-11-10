import { TFunction, TOptions } from "i18next";

interface FormsyErrorMessage extends TOptions {
  equals?: string;
  equalsField?: string;
  isLength?: number;
  minLength?: number;
  maxLength?: number;
}

export const formsyErrorMessage = (t: TFunction, field: string, p?: FormsyErrorMessage) => {
  return {
    isEmail: t("formsy.isEmail", { field, ...p }),
    isUrl: t("formsy.isUrl", { field, ...p }),
    isExisty: t("formsy.isExisty", { field, ...p }),
    isUndefined: t("formsy.isUndefined", { field, ...p }),
    isEmptyString: t("formsy.isEmptyString", { field, ...p }),
    isTrue: t("formsy.isTrue", { field, ...p }),
    isFalse: t("formsy.isFalse", { field, ...p }),
    isAlpha: t("formsy.isAlpha", { field, ...p }),
    isNumeric: t("formsy.isNumeric", { field, ...p }),
    isAlphanumeric: t("formsy.isAlphanumeric"),
    isInt: t("formsy.isInt", { field, ...p }),
    isFloat: t("formsy.isFloat", { field, ...p }),
    isWords: t("formsy.isWords", { field, ...p }),
    isSpecialWords: t("formsy.isSpecialWords", { field, ...p }),
    equals: t("formsy.equals", { field, ...p }),
    equalsField: t("formsy.equalsField", { field, ...p }),
    isLength: t("formsy.isLength", { field, ...p }),
    minLength: t("formsy.minLength", { field, ...p }),
    maxLength: t("formsy.maxLength", { field, ...p }),
  };
};
