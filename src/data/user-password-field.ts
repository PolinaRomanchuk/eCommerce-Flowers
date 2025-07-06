export type PasswordFieldData = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  error: string;
  setError: (error: string) => void;
  validate: (value: string) => string;
};
