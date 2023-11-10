import { WithFormsy } from "interface/formsy";

export function omitFormsyProps<T = any, V = any>(props: WithFormsy<T, V> | any): WithFormsy<T, V> {
  const {
    debounce,
    innerRef,
    // name,
    // required,
    validationError,
    validationErrors,
    validations,
    // value,

    // label,

    errorMessage,
    errorMessages,
    hasValue,
    isFormDisabled,
    isFormSubmitted,
    isPristine,
    isRequired,
    isValid,
    isValidValue,
    resetValue,
    setValidations,
    setValue,
    showError,
    showRequired,
    attachToForm,
    detachFromForm,
    runValidation,
    validate,

    ...rest
  } = props;

  return rest as any;
}
