import React, { useEffect, useState } from 'react';
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
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { baseUrl } from '../../core';
import Page from '../../components/Page';
import { FormProvider, RHFTextField, RHFDropDown, RHFMultiSelect } from '../../components/hook-form';
import DragNDrop from '../../components/DragNDrop/DragNDrop';
import useAlert from '../../hooks/useAlert';

function UpdateContentDetail() {
  const { setAlert } = useAlert();
  const location = useLocation();
  const { id } = useParams();

  const [categoryList, setCategoryList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [ConfirmationDialog, setConfirmationDialog] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [imgSrc, setImgSrc] = useState(`${baseUrl}/${location.state?.thumbnailUrl}`);
  const [newImgSrc, setNewImgSrc] = useState('');
  const [imgFile, setImgFile] = useState(null);

  useEffect(() => {
    getCategoriesList();
    getContentList();

    // eslint-disable-next-line
  }, [refresh]);

  const getCategoriesList = () => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-categories`,
      withCredentials: true,
    })
      .then((res) => {
        const list = res.data.data;
        const finalList = [];

        list.forEach((item) => {
          if (item.parentId === '0') {
            item.categoryHierarchy = item.category;
          } else {
            const obj = list.find((i) => item.parentId === i._id);
            console.log('obj', obj);
            item.categoryHierarchy = `${obj?.category} > ${item.category}`;
          }
          finalList.push(item);
        });

        setCategoryList(finalList);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const getContentList = () => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-content-details`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        setContentList(res.data.data.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleConfirmationDialogOpen = () => {
    setConfirmationDialog(true);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialog(false);
  };

  const handleUpdateContent = () => {
    const formData = new FormData();
    const { meta, tags } = updatedData;
    if (meta?.length > 0) {
      meta?.forEach((item, index) => {
        formData.append(`meta[${index}]`, meta[index]);
      });
    }
    if (tags?.length > 0) {
      tags?.forEach((item, index) => {
        formData.append(`tags[${index}]`, tags[index]);
      });
    }

    delete updatedData.meta;
    delete updatedData.tags;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }

    if (imgFile) {
      formData.append('folderName', 'contentDetail');
      formData.append('image', imgFile);
    }

    console.log('formData', formData);

    axios({
      method: 'PUT',
      url: `${baseUrl}/api/v1/admin/update-content-detail/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

  const ContentSchema = Yup.object().shape({
    name: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  // const defaultValues = {
  //     name: '',
  //     description: '',
  //     year: '',
  //     rating: 0,
  //     thumbnailUrl: '',
  //     imageUrl: '',
  //     videoUrl: '',
  //     meta: '',
  //     tags: '',
  //     inBanner: '',
  //     categoryId: '',
  //     status: "active",
  // };

  const defaultValues = location.state;
  const methods = useForm({
    resolver: yupResolver(ContentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const data = methods.getValues();
    setUpdatedData(data);
    if (!checkGivenNameAlreadyExist(data)) {
      handleConfirmationDialogOpen();
    }
  };

  const checkGivenNameAlreadyExist = (data) => {
    const { categoryId, name } = data;

    console.log(data);

    const selectedLevelExiistingCategories = contentList.filter((item) => item.categoryId === categoryId);

    const containsGivenName = selectedLevelExiistingCategories.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    console.log(containsGivenName);
    if (containsGivenName.length > 0) {
      setAlert('Current name already exists! Please enter another name', 'error');
      return true;
    }

    return false;
  };

  return (
    <Page title="Update Content Details">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Categories
          </Typography>
          <Button component={RouterLink} to="/dashboard/content-details" variant="contained">
            View Content Details
          </Button>
        </Stack>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField required name="name" label="Name" />
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </RHFDropDown>
              </Stack>
              <RHFTextField required name="description" label="Description" />
              <RHFDropDown
                id="categoryId"
                name="categoryId"
                label="Select Category"
                variant="outlined"
                margin="normal"
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                {categoryList.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {' '}
                    {item.categoryHierarchy}
                  </MenuItem>
                ))}
              </RHFDropDown>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="year" label="Year" />
                <RHFTextField name="rating" label="Rating" />
              </Stack>

              {/* <RHFTextField required name="thumbnailUrl" label="Thumbnail Url" /> */}
              {/* <RHFTextField
                name="imageUrl"
                label="Image Url"
                placeholder="https://www.kasandbox.org/programming-images/avatars/cs-hopper-happy.png"
              /> */}
              <RHFTextField
                name="videoUrl"
                label="Video Url"
                placeholder="https://www.youtube.com/watch?v=XSrv3YZb1wI"
              />
              <RHFTextField name="videoId" label="Video Id" placeholder="XSrv3YZb1wI" />
              <RHFMultiSelect options={[]} defaultValue={defaultValues.meta} name="meta" label="Meta" />
              <RHFMultiSelect options={[]} defaultValue={defaultValues.tags} name="tags" label="Tags" />
              <RHFDropDown
                id="inBanner"
                name="inBanner"
                label="Show Banner"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              >
                <MenuItem value="">Select </MenuItem>
                <MenuItem value>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </RHFDropDown>
              <RHFDropDown
                id="isPaid"
                name="isPaid"
                label="Is Paid"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              >
                <MenuItem value="">Select </MenuItem>
                <MenuItem value>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </RHFDropDown>
              <DragNDrop
                images
                setImageSrc={setNewImgSrc}
                getFile={setImgFile}
                dimensions={{ width: 125, height: 140 }}
              />
              {
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {newImgSrc ? (
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setNewImgSrc(null);
                          setImgFile(null);
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                      <img src={newImgSrc} height="140" width="125" alt="img" />
                    </Stack>
                  ) : (
                    imgSrc && <img src={imgSrc} height="140" width="125" alt="img" />
                  )}
                </Box>
              }
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Update Content
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
