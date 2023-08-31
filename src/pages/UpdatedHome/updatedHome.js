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
import { FormProvider, RHFTextField, RHFDropDown, RHFMultiSelect } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';
import DragNDrop from '../../components/DragNDrop/DragNDrop';

function UpdatedHome() {
  const { setAlert } = useAlert();
  const [categoryList, setCategoryList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgFile, setImgFile] = useState(null);

  const ContentSchema = Yup.object().shape({
    name: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    name: '',
    description: '',
    year: '',
    rating: 0,
    // thumbnailUrl: '',
    // imageUrl: '',
    videoUrl: '',
    videoId: '',
    meta: [],
    tags: [],
    inBanner: false,
    categoryId: '',
    status: 'active',
  };

  const methods = useForm({
    resolver: yupResolver(ContentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const { meta, tags } = data;
      if (!imgFile) {
        setAlert('Please select an image to proceed!', 'error');
        return reject();
      }
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
      delete data.meta;
      delete data.tags;
      // eslint-disable-next-line no-restricted-syntax
      for (const key in data) {
        formData.append(key, data[key]);
      }
      if (imgFile) {
        formData.append('folderName', 'contentDetail');
        formData.append('image', imgFile);
      }

      console.log('formData', formData);

      if (!checkGivenNameAlreadyExist(data)) {
        axios({
          method: 'POST',
          url: `${baseUrl}/api/v1/admin/add-content-detail`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
          .then((res) => {
            console.log(res.data);
            updateHome();
            setAlert('Content Successfully Added!', 'success');
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
  const updateHome = async () => {
    await axios({
      method: 'POST',
      // url: `${baseUrl}/api/v1/admin/get-content-data`,
      url: `${baseUrl}/api/v1/admin/update-home`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        console.log('runing');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const checkGivenNameAlreadyExist = (data) => {
    const { categoryId, name } = data;

    // console.log(data)

    const selectedLevelExiistingCategories = contentList.filter((item) => item.categoryId === categoryId);

    const containsGivenName = selectedLevelExiistingCategories.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (containsGivenName.length > 0) {
      setAlert('Current name already exists! Please enter another name', 'error');
      return true;
    }

    return false;
    // return true
  };

  return (
    <Page title="Add Content Details">
      <Container>
        <Button onClick={() => updateHome()} variant="contained">
          Update All
        </Button>

        <Card style={{ padding: '14px' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {/* <RHFDropDown
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
                </RHFDropDown> */}
              </Stack>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}

export default UpdatedHome;
