import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField, Chip } from '@mui/material';

// ----------------------------------------------------------------------

RHFMultiSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.array,
  options: PropTypes.array
};

export default function RHFMultiSelect({
  name,
  label,
  options,
  defaultValue,
  ...props }) {
  const { control } = useFormContext();


  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          onChange={(evt, value) => onChange(value)}
          value={value}
          options={options.map((option) => option)}
          defaultValue={defaultValue}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" key={index} label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              {...props}
              label={label}
              helperText={error?.message}
              placeholder={label}
            />
          )}
        />
      )}
    />
  );
}