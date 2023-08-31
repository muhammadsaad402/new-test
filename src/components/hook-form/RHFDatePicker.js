import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// import { DatePicker, LocalizationProvider, AdapterDayjs } from '@mui/lab';

// ----------------------------------------------------------------------

RHFDatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};

export default function RHFDatePicker({
  name,
  label,
  ...props }) {
  const { control } = useFormContext();


  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // disableFuture
            label={label}
            // openTo="year"
            views={['year', 'month', 'day']}
            value={value ? dayjs(value).format('YYYY-MM-DD') : null}
            // onChange={(evt) => onChange(dayjs(evt.$d.).format('YYYY-MM-DD'))}
            onChange={onChange}
            renderInput={(params) => <TextField {...props}{...params} />}
            error={error?.message}
            {...props}
          />
        </LocalizationProvider>
      )}
    />
  );
}