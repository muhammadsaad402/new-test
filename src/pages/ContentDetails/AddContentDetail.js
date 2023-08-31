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
    updateHome();
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
            // console.log("obj", obj)
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
        // console.log(res.data)
        setContentList(res.data.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

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
    isPaid: false,
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
    // eslint-disable-next-line consistent-return
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
  const updateHome = () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzMDYxZDRkNjkzNTI5YmY3NzU0OGFlNiIsImVtYWlsIjoibWFuYWdlckBzaWRhdC5uZXQiLCJuYW1lIjoiQWRtaW4ifSwiaWF0IjoxNjY5NDg1MjI4fQ.oTP3-HTwkhRblj6Esh9b7I62G2OHue5GD5OFxtD6vA0';

    axios
      .post(
        // 'https://jagoopakistan.com/api/v1/admin/update-home'
        `${baseUrl}/api/v1/admin/update-home`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log('data', res);
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Content Detail
          </Typography>
          <Button component={RouterLink} to="/dashboard/content-details" variant="contained">
            View Content Details
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
                placeholder="https://www.pakainfo.com/wp-content/uploads/2021/09/sample-image-url-link.png"
              /> */}
              <RHFTextField
                name="videoUrl"
                label="Video Url"
                placeholder="https://www.youtube.com/watch?v=UBsOaqqLhXY"
              />
              <RHFTextField name="videoId" label="Video Id" placeholder="UBsOaqqLhXY" />
              <RHFMultiSelect options={[]} defaultValue={[]} name="meta" label="Meta" />
              <RHFMultiSelect options={[]} defaultValue={[]} name="tags" label="Tags" />
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
              <DragNDrop images setImageSrc={setImgSrc} getFile={setImgFile} dimensions={{ width: 125, height: 140 }} />
              {
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {imgSrc && <img src={imgSrc} height="140" width="125" alt="img" />}
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
