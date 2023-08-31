import * as Yup from 'yup';
import axios from 'axios';
import { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { baseUrl } from '../../../core';
import { GlobalContext } from '../../../context/Context';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import useAlert from '../../../hooks/useAlert';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { setAlert } = useAlert();
  const { dispatch } = useContext(GlobalContext);
  // const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const values = methods.getValues();
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `${baseUrl}/api/v1/admin/login`,
        data: values,
        withCredentials: true,
      })
        .then((res) => {
          console.log('res', res.data);
          resolve();
          setAlert('Login Success!', 'success');

          localStorage.setItem('Token', res?.data?.token);
          dispatch({
            type: 'USER_LOGIN',
            payload: {
              email: res.data.user.email,
              _id: res.data.user._id,
            },
          });
        })
        .catch((error) => {
          console.log('error', error);
          reject(error);
          setAlert(error.response.data.message, 'error');
        });
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          name="email"
          label="Email address"
        />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          {/* Forgot password? */}
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
