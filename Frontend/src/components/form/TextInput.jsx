import { TextField } from '@mui/material';
import { useField } from 'formik';

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  
  return (
    <TextField
      {...field}
      {...props}
      label={label}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};