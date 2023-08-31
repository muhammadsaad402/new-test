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
import { FormProvider, RHFTextField, RHFDropDown, RHFMultiSelect, RHFDatePicker } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';
import DragNDrop from '../../components/DragNDrop/DragNDrop';

function AddContentDetail() {
  const { setAlert } = useAlert();
  const [categoryList, setCategoryList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgFile, setImgFile] = useState(null);

  useEffect(() => {
    getCategoriesList();
    getContentList();
    // eslint-disable-next-line
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

  const ContentSchema = Yup.object().shape({
    title: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    url: '',
    vidoId: '',
    date: '',
    params: [],
    tags: [],
    isNewContent: '',
    isPaid: false,
    categoryId: '',
    status: 'active',
  };

  const methods = useForm({
    resolver: yupResolver(ContentSchema),
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
      const formData = new FormData();
      const { params, tags } = data;
      if (!imgFile) {
        setAlert('Please select an image to proceed!', 'error');
        return reject();
      }
      if (params?.length > 0) {
        params?.forEach((item, index) => {
          formData.append(`params[${index}]`, item);
        });
      }
      if (tags?.length > 0) {
        tags?.forEach((item, index) => {
          formData.append(`tags[${index}]`, item);
        });
      }
      delete data.params;
      delete data.tags;
      // eslint-disable-next-line no-restricted-syntax
      for (const key in data) {
        formData.append(key, data[key]);
      }
      if (imgFile) {
        formData.append('folderName', 'contentData');
        formData.append('image', imgFile);
      }

      console.log('formData', formData);

      if (!checkGivenNameAlreadyExist(data)) {
        axios({
          method: 'POST',
          url: `${baseUrl}/api/v1/admin/add-content-data`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
          .then((res) => {
            console.log(res.data);
            setAlert('Content Successfully Added!', 'success');
            setRefresh(!refresh);
            resolve();
            // reset(defaultValues)
            // setImgSrc('')
            // setImgFile(null)
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

  const checkGivenNameAlreadyExist = (data) => {
    const { categoryId, title } = data;

    console.log(data);

    const selectedLevelExiistingCategories = contentList.filter((item) => item.categoryId === categoryId);

    const containsGivenName = selectedLevelExiistingCategories.filter(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    );

    if (containsGivenName.length > 0) {
      setAlert('Current name already exists! Please enter another name', 'error');
      return true;
    }

    return false;
  };

  return (
    <Page title="Add Content Data">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Content Data
          </Typography>
          <Button component={RouterLink} to="/dashboard/content-data" variant="contained">
            View Content Data
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
                  placeholder="The maximum length of a Title is 20 characters "
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </RHFDropDown>
              </Stack>
              <RHFTextField required name="description" label="Description" />
              <RHFDropDown
                id="categoryId"
                name="categoryId"
                // label="Select Category"
                label="Select Content Title"
                variant="outlined"
                margin="normal"
                required
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
              <RHFDatePicker name="date" label="Date" />
              {/* <RHFTextField name="date" label="Date" /> */}
              {/* <RHFTextField required name="thumbnailUrl" label="Thumbnail Url" /> */}
              <RHFTextField required name="url" label="Video Url" />
              <RHFTextField required name="videoId" label="Video Id" />

              {/* <RHFMultiSelect options={[]} defaultValue={[]} name="params" label="Params" /> */}
              <RHFMultiSelect options={[]} defaultValue={[]} name="tags" label="Tags" />

              <RHFDropDown
                id="isNewContent"
                name="isNewContent"
                label="Is New"
                variant="outlined"
                margin="normal"
                fullWidth
              >
                <MenuItem value="">Select </MenuItem>
                <MenuItem value>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </RHFDropDown>

              <RHFDropDown id="isPaid" name="isPaid" label="Is Paid" variant="outlined" margin="normal" fullWidth>
                <MenuItem value="">Select </MenuItem>
                <MenuItem value>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </RHFDropDown>

              <DragNDrop images setImageSrc={setImgSrc} getFile={setImgFile} dimensions={{ width: 131, height: 95 }} />
              {
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {imgSrc && <img src={imgSrc} height="95" width="131" alt="img" />}
                </Box>
              }

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Add Content
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}

export default AddContentDetail;
