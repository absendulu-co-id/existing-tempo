/* eslint-disable @typescript-eslint/unbound-method */
import clone from "lodash/clone";
import isEqual from "lodash/isEqual";
import setWith from "lodash/setWith";
import { useCallback, useState } from "react";

function setIn(state, name, value) {
  return setWith(clone(state), name, value, clone);
}

function useForm(initialState, onSubmit) {
  const [form, setForm] = useState(initialState);

  const handleChange = useCallback((event) => {
    event.persist();
    setForm((form) =>
      setIn(
        { ...form },
        event.target.name,
        event.target.type === "checkbox" ? event.target.checked : event.target.value,
      ),
    );
  }, []);

  const resetForm = useCallback(() => {
    if (!isEqual(initialState, form)) {
      setForm(initialState);
    }
  }, [form, initialState]);

  const setInForm = useCallback((name, value) => {
    setForm((form) => setIn(form, name, value));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      if (event) {
        event.preventDefault();
      }
      if (onSubmit) {
        onSubmit();
      }
    },
    [onSubmit],
  );

  return {
    form,
    handleChange,
    handleSubmit,
    resetForm,
    setForm,
    setInForm,
  };
}

export default useForm;
