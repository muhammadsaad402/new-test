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
import { FormProvider, RHFTextField, RHFDropDown, RHFDatePicker } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';
import DragNDrop from '../../components/DragNDrop/DragNDrop';

function UpdateFeaturedBanner() {
  const { setAlert } = useAlert();
  const location = useLocation();
  const { id } = useParams();

  const [bannerList, setBannerList] = useState([]);
  const [completebannerList, setCompleteBannerList] = useState([]);
  const [ConfirmationDialog, setConfirmationDialog] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [imgSrc, setImgSrc] = useState(`${baseUrl}/${location.state?.bannerImageUrl}`);
  const [newImgSrc, setNewImgSrc] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getBannerList();
    getContentList();
    getCategoriesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const getCategoriesList = () => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-content-details`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        setCategoryList(res.data.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const getContentList = () => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-content-data`,
      withCredentials: true,
    })
      .then((res) => {
        setContentList(res.data.data.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const getBannerList = () => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-featured-banners`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data.data);
        const sortedData = JSON.parse(JSON.stringify(res.data.data)).sort((a, b) => a.order - b.order);
        console.log(sortedData);
        setCompleteBannerList(sortedData);
        const data = res.data.data.filter((item) => item._id !== id);
        setBannerList(data);
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

    delete updatedData.bannerImgUrl;
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }

    if (imgFile) {
      formData.append('folderName', 'featuredBanner');
      formData.append('image', imgFile);
    }

    axios({
      method: 'PUT',
      url: `${baseUrl}/api/v1/admin/update-featured-banner/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        handleConfirmationDialogClose();
        setAlert('Banner Updated Successfully!', 'success');
        setRefresh(!refresh);
      })
      .catch((error) => {
        setAlert(error.message, 'error');
        handleConfirmationDialogClose();
      });
  };

  const BannerSchema = Yup.object().shape({
    title: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
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
    resolver: yupResolver(BannerSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const data = methods.getValues();
    setUpdatedData(data);
    if (!checkGivenTitleAlreadyExist(data)) {
      handleConfirmationDialogOpen();
    }
  };

  const checkGivenTitleAlreadyExist = (data) => {
    const { categoryId, title } = data;
    console.log(data);
    const bannerList = contentList.filter((item) => item.categoryId === categoryId);
    console.log(bannerList);
    const containsGivenName = bannerList.filter((item) => item.title.toLowerCase() === title.toLowerCase());

    if (containsGivenName.length > 0) {
      setAlert('Current title already exists! Please enter another title', 'error');
      return true;
    }

    return false;
  };

  return (
    <Page title="Update Featured Banner">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Update Featured Banner
          </Typography>
          <Button component={RouterLink} to="/dashboard/featured-banners" variant="contained">
            View Featured Banners
          </Button>
        </Stack>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField required name="title" label="Title" />
                <RHFDropDown
                  id="status"
                  name="status"
                  label="Select Status"
                  variant="outlined"
                  fullWidth
                  required
                  margin="dense"
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </RHFDropDown>
              </Stack>
              <RHFTextField required name="description" label="Description" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFDropDown
                  id="type"
                  name="type"
                  label="Select Type"
                  variant="outlined"
                  // margin="normal"
                  fullWidth
                  // required
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                </RHFDropDown>
                <RHFDropDown
                  id="order"
                  name="order"
                  label="Select Order"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                >
                  <MenuItem value="">Select Click Type</MenuItem>
                  {Array(15)
                    .fill(0)
                    .map((item, index) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    ))}
                </RHFDropDown>
              </Stack>

              <RHFDropDown
                id="clickType"
                name="clickType"
                label="Select Click Type"
                variant="outlined"
                // margin="normal"
                fullWidth
                // required
              >
                <MenuItem value="">Select Click Type</MenuItem>
                <MenuItem value="internal">Internal</MenuItem>
                <MenuItem value="external">External</MenuItem>
              </RHFDropDown>
              <RHFDropDown
                id="categoryId"
                name="categoryId"
                // label="Select Category"
                label="Select Content Title"
                variant="outlined"
                margin="normal"
                // required
              >
                {/* <MenuItem value="">Select Category</MenuItem> */}
                <MenuItem value="">Select Content Title</MenuItem>
                {categoryList.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {' '}
                    {item.name}
                  </MenuItem>
                ))}
              </RHFDropDown>
              {/* <RHFTextField required name="bannerImageUrl" label="Banner Image URL" /> */}
              <RHFTextField name="contentPath" label="Content Path" />
              <RHFTextField name="link" label="Link" />
              {/* <RHFTextField required name="publishDate" label="Publish Date" /> */}
              <RHFDatePicker required name="publishDate" label="Publish Date" />
              <DragNDrop
                images
                setImageSrc={setNewImgSrc}
                getFile={setImgFile}
                dimensions={{ width: 327, height: 189 }}
              />
              {
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {newImgSrc && imgFile ? (
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setNewImgSrc('');
                          setImgFile(null);
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                      <img src={newImgSrc} height="189" width="327" alt="img" />
                    </Stack>
                  ) : (
                    imgSrc && <img src={imgSrc} height="189" width="327" alt="img" />
                  )}
                </Box>
              }
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Update Banner
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

export default UpdateFeaturedBanner;
