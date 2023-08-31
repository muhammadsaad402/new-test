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

function AddNotification() {
  const { setAlert } = useAlert();

  const userSchema = Yup.object().shape({
    // title: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    title: '',
    body: '',
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
        // url: `${baseUrl}/api/v1/admin/sendToAll`,
        url: `${baseUrl}/api/v1/admin/addNotification`,
        data,
        withCredentials: true,
      })
        .then((res) => {
          console.log(res.data);
          setAlert('Notification send successfully!', 'success');
          resolve();
          reset(defaultValues);
        })
        .catch((error) => {
          console.log('error', error);
          reject(error);
        });
    });
  };

  return (
    <Page title="Push Notification">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Push Notification
          </Typography>
          <Button component={RouterLink} to="/dashboard/get-notification" variant="contained">
            View Notification Data
          </Button>
        </Stack>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField
                  required
                  name="title"
                  label="Title"
                  inputProps={{ maxLength: 20 }}
                  placeholder="The maximum length of a Name is 20 characters "
                />
              </Stack>
              {/* <RHFTextField required name="description" label="Description" /> */}

              <RHFTextField name="body" label="Text" />

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Add Notification
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}

export default AddNotification;
