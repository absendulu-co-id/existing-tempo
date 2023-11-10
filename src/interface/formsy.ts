import { PassDownProps } from "formsy-react/dist/withFormsy";

interface CustomProps {
  label?: string;
  helperText?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => void;
  errorMessage?: string;
  required?: boolean;
  debounce?: boolean;
}

export type WithFormsy<T, V = any> = PassDownProps<V> &
  Omit<T, keyof PassDownProps<V> & keyof CustomProps> &
  CustomProps;
