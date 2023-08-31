import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Select, FormControl, InputLabel } from '@mui/material';

// ----------------------------------------------------------------------

RHFDropDown.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  children: PropTypes.node,
};

export default function RHFDropDown({
  name,
  label,
  defaultValue,
  children,
  ...props }) {
  const { control } = useFormContext();
  const labelId = `${name}-label`;

  return (
    <FormControl {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        render={({ field }) => (
          <Select labelId={labelId} label={label} {...field}>
            {children}
          </Select>
        )}
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
}
