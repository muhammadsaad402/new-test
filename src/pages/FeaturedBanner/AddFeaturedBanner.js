/* eslint-disable guard-for-in */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack, Button, Container, Typography, MenuItem, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { baseUrl } from '../../core';
import Page from '../../components/Page';
import { FormProvider, RHFTextField, RHFDropDown, RHFDatePicker } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';
import DragNDrop from '../../components/DragNDrop/DragNDrop';

function AddFeaturedBanner() {
  const { setAlert } = useAlert();
  const [bannerList, setBannerList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgFile, setImgFile] = useState(null);

  useEffect(() => {
    getBannerList();
    getContentList();
    getCategoriesList();
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
        setContentList(res.data.data);
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
        console.log(res.data.data.length);
        setBannerList(res.data.data);
        reset({
          order: res.data.data.length + 1,
          title: '',
          description: '',
          contentPath: '',
          type: '',
          clickType: '',
          categoryId: '',
          link: '',
          createdBy: '',
          publishDate: '',
          bannerImageUrl: '',
          status: 'active',
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const currentOrder = bannerList.length > 0 && bannerList.length + 1;

  const BannerSchema = Yup.object().shape({
    title: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    contentPath: '',
    type: '',
    clickType: '',
    categoryId: '',
    bannerImageUrl: '',
    link: '',
    createdBy: '',
    order: '',
    publishDate: '',
    status: 'active',
  };

  const methods = useForm({
    resolver: yupResolver(BannerSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log('data', data);

    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      if (!imgFile) {
        setAlert('Please select an image to proceed!', 'error');
        return reject();
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const key in data) {
        formData.append(key, data[key]);
      }
      if (imgFile) {
        formData.append('folderName', 'featuredBanner');
        formData.append('image', imgFile);
      }

      if (!checkGivenTitleAlreadyExist(data)) {
        axios({
          method: 'POST',
          url: `${baseUrl}/api/v1/admin/add-featured-banner`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
          .then((res) => {
            console.log(res.data);
            setAlert('Banner Successfully Added!', 'success');
            setRefresh(!refresh);
            resolve();
            reset(defaultValues);
            setImgSrc('');
            setImgFile(null);
          })
          .catch((error) => {
            console.log('error', error);
            reject(error);
          });
      } else {
        resolve();
      }
    });
  };

  const checkGivenTitleAlreadyExist = (data) => {
    const { categoryId, title } = data;
    const bannerList = contentList.filter((item) => item.categoryId === categoryId);
    const containsGivenName = bannerList.filter((item) => item.title.toLowerCase() === title.toLowerCase());

    if (containsGivenName.length > 0) {
      setAlert('Current title already exists! Please enter another title', 'error');
      return true;
    }

    return false;
  };

  return (
    <Page title="Add Featured Banner">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Featured Banner
          </Typography>
          <Button component={RouterLink} to="/dashboard/featured-banners" variant="contained">
            View Featured Banners
          </Button>
        </Stack>

        {bannerList.length > 0 && (
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
                    disabled
                  >
                    <MenuItem value="">Select Order</MenuItem>
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
                  setImageSrc={setImgSrc}
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
                    {imgSrc && <img src={imgSrc} height="189" width="327" alt="img" />}
                  </Box>
                }
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                  Add Banner
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Card>
        )}
      </Container>
    </Page>
  );
}

export default AddFeaturedBanner;
