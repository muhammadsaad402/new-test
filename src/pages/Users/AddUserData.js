/* eslint-disable guard-for-in */
import React from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack, Button, Container, Typography, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { baseUrl } from '../../core';
import Page from '../../components/Page';
import { FormProvider, RHFTextField, RHFDropDown } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';

function AddUserData() {
  const { setAlert } = useAlert();

  const userSchema = Yup.object().shape({
    name: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    phone: '',
    status: 'active',
  };

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `${baseUrl}/api/v1/admin/add-user-data`,
        data,
        withCredentials: true,
      })
        .then((res) => {
          console.log(res.data);
          setAlert('Content Successfully Added!', 'success');
          resolve();
          reset(defaultValues);
          // setImgSrc('')
          // setImgFile(null)
        })
        .catch((error) => {
          console.log('error', error);
          reject(error);
        });
    });
  };

  return (
    <Page title="Add User Data">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add User Data
          </Typography>
          <Button component={RouterLink} to="/dashboard/users" variant="contained">
            View User Data
          </Button>
        </Stack>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField
                  required
                  name="name"
                  label="Name"
                  inputProps={{ maxLength: 20 }}
                  placeholder="The maximum length of a Name is 20 characters "
                />
                <RHFDropDown
                  id="status"
                  name="status"
                  label="Select Status"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </RHFDropDown>
              </Stack>
              {/* <RHFTextField required name="description" label="Description" /> */}

              <RHFTextField name="email" label="Email" />
              <RHFTextField name="password" label="Password" />
              <RHFTextField name="phone" label="Contact No:" />

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Add User
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}

export default AddUserData;
