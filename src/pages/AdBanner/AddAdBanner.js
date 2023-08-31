/* eslint-disable guard-for-in */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Card,
    Stack,
    Button,
    Container,
    Typography,
    MenuItem,
    Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { baseUrl } from '../../core';
import Page from '../../components/Page';
import { FormProvider, RHFTextField, RHFDropDown } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';
import DragNDrop from '../../components/DragNDrop/DragNDrop';


function AddFeaturedBanner() {
    const { setAlert } = useAlert();
    const [bannerList, setBannerList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [imgFile, setImgFile] = useState(null);

    useEffect(() => {
        getBannerList()
    }, [refresh])

    const getBannerList = () => {
        axios({
            method: "GET",
            url: `${baseUrl}/api/v1/admin/get-ad-banners`,
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            setBannerList(res.data.data)
        }).catch((error) => {
            console.log("error", error)
        })
    }

    const BannerSchema = Yup.object().shape({
        title: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
        // password: Yup.string().required('Password is required'),
    });

    const defaultValues = {
        title: '',
        url: '',
        page: '',
        clickType: '',
        placement: '',
        link: '',
        // createdBy: '',
        status: "active",
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
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            if (!imgFile) {
                setAlert('Please select an image to proceed!', 'error')
                return reject()
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const key in data) {
                formData.append(key, data[key]);
            }
            if (imgFile) {
                formData.append("folderName", "adBanner");
                formData.append("image", imgFile);
            }

            console.log("formData", formData)
            if (!(checkGivenTitleAlreadyExist(data))) {
                axios({
                    method: "POST",
                    url: `${baseUrl}/api/v1/admin/add-ad-banner`,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data)
                    setAlert('Banner Successfully Added!', 'success')
                    setRefresh(!refresh)
                    resolve()
                    reset(defaultValues)
                }).catch((error) => {
                    console.log("error", error)
                    reject(error)
                })
            } else {
                resolve()
            }
        })
    }

    const checkGivenTitleAlreadyExist = (data) => {
        const { title } = data

        const containsGivenName = bannerList.filter((item) =>
            item.title.toLowerCase() === title.toLowerCase())

        if (containsGivenName.length > 0) {
            setAlert('Current title already exists! Please enter another title', 'error')
            return true
        }

        return false
    }

    return (
        <Page title="Add Featured Banner">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Add AD Banner
                    </Typography>
                    <Button component={RouterLink} to="/dashboard/ad-banners" variant="contained">
                        View AD Banners
                    </Button>
                </Stack>

                <Card style={{ padding: "14px" }}>
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
                            <RHFTextField name="url" label="URL" />
                            {/* <RHFTextField required name="adImageUrl" label="Ad Image URL" /> */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <RHFTextField name="page" label="Page" />
                                <RHFTextField name="placement" label="Placement" />

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
                            <RHFTextField name="link" label="Link" />

                            <DragNDrop
                                images
                                setImageSrc={setImgSrc}
                                getFile={setImgFile}
                                dimensions={{ width: 320, height: 50 }}
                            />
                            {
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {imgSrc && <img src={imgSrc} height="50" width="320" alt="img" />}
                                </Box>
                            }
                            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Add Banner
                            </LoadingButton>
                        </Stack>
                    </FormProvider>
                </Card>
            </Container>
        </Page >
    )
}

export default AddFeaturedBanner