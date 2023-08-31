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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { baseUrl } from '../../core';
import Page from '../../components/Page';
import { FormProvider, RHFTextField, RHFDropDown, RHFMultiSelect } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';


const packageDuration = [
    { value: "1", label: "1 Month", _id: "sdf3wewe" },
    { value: "2", label: "2 Months", _id: "sdfsad" },
    { value: "3", label: "3 Months", _id: "sdfsaf" },
    { value: "4", label: "4 Months", _id: "sdfdfgeswae" },
    { value: "5", label: "5 Months", _id: "sdf3sdfswae" },
    { value: "6", label: "6 Months", _id: "sdfsagswae" },
    { value: "12", label: "1 Year", _id: "sdf3dsfe" },
    { value: "24", label: "2 Years", _id: "sdasdswae" },
]


function AddPackage() {
    const { setAlert } = useAlert();
    // const [categoryList, setCategoryList] = useState([]);
    // const [dataList, setDataList] = useState([]);
    // const [refresh, setRefresh] = useState(false);

    // useEffect(() => {

    //     // eslint-disable-next-line
    // }, [refresh])

    const PackageSchema = Yup.object().shape({
        packageName: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
        packagePrice: Yup.number().min(0, 'must be a positive value').required('Price is required'),
        packageDuration: Yup.string().required('Duration is required'),
        packageFeatures: Yup.array().required('Features are required'),
        status: Yup.string().required('please select a status'),
    });

    const defaultValues = {
        packageName: '',
        packagePrice: 0,
        packageDuration: '',
        packageFeatures: '',
        status: "active",
    };

    const methods = useForm({
        resolver: yupResolver(PackageSchema),
        defaultValues
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        return new Promise((resolve, reject) => {
            axios({
                method: "POST",
                url: `${baseUrl}/api/v1/admin/add-package`,
                data,
                withCredentials: true
            }).then((res) => {
                console.log(res.data)
                setAlert('Package Successfully Added!', 'success')
                resolve()
                reset(defaultValues)
            }).catch((error) => {
                console.log("error", error)
                reject(error)
            })
        })
    }

    return (
        <Page title="Add Packages">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Add Packages
                    </Typography>
                    <Button component={RouterLink} to="/dashboard/packages" variant="contained">
                        View Packages
                    </Button>
                </Stack>

                <Card style={{ padding: "14px" }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <RHFTextField name="packageName" label="Package Name" />
                                <RHFTextField type='number' name="packagePrice" label="Package Price" />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <RHFDropDown
                                    id="packageDuration"
                                    name="packageDuration"
                                    label="Select Duration"
                                    variant="outlined"
                                    fullWidth
                                >
                                    <MenuItem value=" ">Select Duration</MenuItem>
                                    {
                                        packageDuration.map((item) => (
                                            <MenuItem key={item._id} value={item.label}>{item.label}</MenuItem>
                                        ))
                                    }
                                </RHFDropDown>
                                <RHFDropDown
                                    id="status"
                                    name="status"
                                    label="Select Status"
                                    variant="outlined"
                                    fullWidth
                                >
                                    <MenuItem value=" ">Select Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </RHFDropDown>
                            </Stack>

                            <RHFMultiSelect options={[]} defaultValue={[]} name="packageFeatures" label="Package Features" />

                            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Add Package
                            </LoadingButton>
                        </Stack>
                    </FormProvider>
                </Card>
            </Container>
        </Page >
    )
}

export default AddPackage