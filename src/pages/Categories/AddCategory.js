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
import { FormProvider, RHFTextField, RHFDropDown } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';

function AddCategory() {
    const { setAlert } = useAlert();
    const [categoryList, setCategoryList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${baseUrl}/api/v1/admin/get-categories`,
            withCredentials: true
        }).then((res) => {
            const { data } = res.data
            setDataList(data)
            const finalList = []
            let list = []

            // this condition is to show only root category and its direct child
            const rootCategories = data.filter(item => item.parentId === "0")

            list = [...rootCategories]

            rootCategories.forEach((rootCategory) => {
                const remaining = data.filter(item => item.parentId === rootCategory._id)
                if (remaining.length > 0) list.push(...remaining)
            })
            // condition ends here 

            list.forEach((item) => {
                if (item.parentId === "0") {
                    item.categoryHierarchy = item.category
                } else {
                    const obj = data.find((i) => item.parentId === i._id)
                    item.categoryHierarchy = `${obj?.category} > ${item.category}`
                }
                finalList.push(item)
            })

            setCategoryList(finalList)

        }).catch((error) => {
            console.log("error", error)
        })
        // eslint-disable-next-line
    }, [refresh])

    const CategorySchema = Yup.object().shape({
        category: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
        status: Yup.string().required('please select a status'),
    });

    const defaultValues = {
        category: '',
        parentId: '0',
        status: "active",
    };

    const methods = useForm({
        resolver: yupResolver(CategorySchema),
        defaultValues
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        return new Promise((resolve, reject) => {
            if (!(checkGivenCategoryNameAlreadyExist(data))) {
                axios({
                    method: "POST",
                    url: `${baseUrl}/api/v1/admin/add-category`,
                    data,
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data)
                    setAlert('Category Successfully Added!', 'success')
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
        });

    }

    const checkGivenCategoryNameAlreadyExist = (data) => {
        console.log(data)
        const { parentId, category } = data

        const selectedLevelExiistingCategories = dataList.filter(item => item.parentId === parentId)

        const containsGivenName = selectedLevelExiistingCategories.filter((item) =>
            item.category.toLowerCase() === category.toLowerCase())

        if (containsGivenName.length > 0) {
            setAlert('Category name already exists! Please enter another name', 'error')
            return true
        }

        return false
    }

    return (
        <Page title="Add Category">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Add Categories
                    </Typography>
                    <Button component={RouterLink} to="/dashboard/categories" variant="contained">
                        View Categories
                    </Button>
                </Stack>

                <Card style={{ padding: "14px" }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <RHFTextField name="category" label="Category Name" />
                                <RHFDropDown
                                    id="status"
                                    name="status"
                                    label="Select Status"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                >
                                    <MenuItem value=" ">Select Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </RHFDropDown>
                            </Stack>

                            <RHFDropDown
                                id="parentId"
                                name="parentId"
                                label="Select Parent Category"
                                variant="outlined"
                                margin="normal"
                            >
                                <MenuItem value="0">Root Category</MenuItem>
                                {
                                    categoryList.map((item, index) => <MenuItem
                                        key={index}
                                        value={item._id} > {item.categoryHierarchy}</MenuItem>)
                                }
                            </RHFDropDown>

                            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Add Category
                            </LoadingButton>
                        </Stack>
                    </FormProvider>
                </Card>
            </Container>
        </Page >
    )
}

export default AddCategory