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
import { FormProvider, RHFTextField, RHFDropDown, RHFMultiSelect } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';

function UpdateContentDetail() {
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
      url: `${baseUrl}/api/v1/admin/update-user-data/${id}`,
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

  const userSchema = Yup.object().shape({
    email: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
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
            Update User
          </Typography>
          <Button component={RouterLink} to="/dashboard/users " variant="contained">
            View User Data
          </Button>
        </Stack>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="name" label="Name" />
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
              <RHFTextField name="email" label="E-Mail" />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="phone" label="Contact No:" />
                <RHFDropDown
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
                </RHFDropDown>
              </Stack>
              {/* <RHFTextField name="interestedCategories" label="Interested Categories" /> */}
              <RHFMultiSelect
                options={[]}
                defaultValue={[]}
                name="interestedCategories"
                label="Interested Categories"
              />
              {/* <RHFTextField name="description" label="Description" /> */}
              {/* <RHFTextField name="currentPackage" label="Package" /> */}

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Update User
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
        </DialogActions>
      </Dialog>
    </Page>
  );
}

export default UpdateContentDetail;
