import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  MenuItem,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { baseUrl } from '../../core';
import Page from '../../components/Page';
import { FormProvider, RHFTextField, RHFDropDown } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';

function UpdateNotification() {
  const { setAlert } = useAlert();
  const location = useLocation();
  const { id } = useParams();
  const [ConfirmationDialog, setConfirmationDialog] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  const [refresh, setRefresh] = useState(false);
  console.log(location.state);
  const handleConfirmationDialogOpen = () => {
    setConfirmationDialog(true);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialog(false);
  };

  const handleUpdateContent = () => {
    axios({
      method: 'PUT',
      url: `${baseUrl}/api/v1/admin/updateNotification/${id}`,
      data: updatedData,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        handleConfirmationDialogClose();
        setAlert('Content Updated Successfully!', 'success');
        setRefresh(!refresh);
      })
      .catch((error) => {
        setAlert(error.message, 'error');
        handleConfirmationDialogClose();
      });
  };
  const handleUpdateContentAndSend = () => {
    // axios({
    //   // method: 'PUT',
    //   // url: `${baseUrl}/api/v1/admin/sendToAll/${id}`,
    //   method: 'POST',
    //   url: `${baseUrl}/api/v1/admin/sendToAll/`,
    //   data: updatedData,
    //   withCredentials: true,
    // })
    axios({
      method: 'PUT',
      url: `${baseUrl}/api/v1/admin/update-send/${id}`,
      data: updatedData,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        handleConfirmationDialogClose();
        setAlert('Content Updated Successfully!', 'success');
        setRefresh(!refresh);
        addNotification();
      })
      .catch((error) => {
        setAlert(error.message, 'error');
        handleConfirmationDialogClose();
      });
  };
  const addNotification = async () => {
    const tokenValue =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzOWMxZTZhMjMyNTA2ZjgzMmIxMGM3NSIsIm5hbWUiOiJab2hhaWJSYW5hIiwiZW1haWwiOiJyYW5hQGdtYWlsLmNvbSIsInN0YXR1cyI6IkFjdGl2ZSIsImN1cnJlbnRQYWNrYWdlIjoiNjMzZDYzYTk2MDA1OWMzNGEzNGU0MzM3IiwiaW50ZXJlc3RlZENhdGVnb3JpZXMiOltdLCJjcmVhdGVkQXQiOiIyMDIyLTEyLTE2VDA3OjI5OjQ2LjA5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTEyLTE2VDA3OjI5OjQ2LjA5NFoiLCJfX3YiOjB9LCJpYXQiOjE2NzExODA0MDZ9.gfdMNFGRFlxslYe6ct4N7axdwtcQyMIfcE3WhaRVjXI';
    console.log('whatIsData', updatedData);
    axios
      .post(
        `${baseUrl}/api/v1/admin/add-all-notification`,
        {
          body: updatedData?.body,
          title: updatedData?.title,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log('myData', response);
      })
      .catch((error) => {
        console.log('myData', error);
      });
  };
  const userSchema = Yup.object().shape({
    title: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
  });

  const defaultValues = location.state;
  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const data = methods.getValues();
    setUpdatedData(data);

    handleConfirmationDialogOpen();

    console.log('function', data);
  };

  return (
    <Page title="Update User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Update Notification
          </Typography>
          <Button component={RouterLink} to="/dashboard/get-notification " variant="contained">
            View Notification
          </Button>
        </Stack>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField body="name" label="Name" />
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
              </Stack> */}
              <RHFTextField name="title" label="Title" />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="body" label="Message" />
                {/* <RHFDropDown
                  id="gender"
                  name="gender"
                  label="Select Gender"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </RHFDropDown> */}
              </Stack>
              {/* <RHFTextField name="interestedCategories" label="Interested Categories" /> */}
              {/* <RHFTextField name="description" label="Description" /> */}
              {/* <RHFTextField name="currentPackage" label="Package" /> */}

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Update Notifcation
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
      {/* Confirmation Dialog */}
      <Dialog
        open={ConfirmationDialog}
        onClose={handleConfirmationDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you sure '}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Performing this action will insert current changes and previous changes will be lost forever.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateContent} autoFocus>
            Confirm
          </Button>
          <Button onClick={handleUpdateContentAndSend} autoFocus>
            Update & Send
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}

export default UpdateNotification;
