import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
import { FormProvider, RHFTextField, RHFDropDown } from '../../components/hook-form';
import useAlert from '../../hooks/useAlert';

function UpdateCategory() {
    const { setAlert } = useAlert();
    const location = useLocation();
    const { id } = useParams()
    const [categoryList, setCategoryList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [ConfirmationDialog, setConfirmationDialog] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getCategoryList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh])



    const getCategoryList = () => {
        axios({
            method: "GET",
            url: `${baseUrl}/api/v1/admin/get-categories`,
            withCredentials: true
        }).then((res) => {
            const data = res.data.data.filter((item) => item._id !== id && item.parentId !== id)
            setDataList(data)
            const finalList = []
            let list = []

            // this condition is to show only root category and its direct child
            const rootCategories = data.filter(item => item.parentId === "0")

            list = [...rootCategories]

            rootCategories.forEach((rootCategory) => {
                const remaining = data.filter(item => item.parentId === rootCategory._id)
                console.log("remaining", remaining)
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
            setAlert(error.message, 'error')
        })
    }

    const handleConfirmationDialogOpen = () => {
        setConfirmationDialog(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialog(false);
    };

    const checkGivenCategoryNameAlreadyExist = (data) => {
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

    const handleUpdateCategory = () => {
        axios({
            method: "PUT",
            url: `${baseUrl}/api/v1/admin/update-category/${id}`,
            data: updatedData,
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            handleConfirmationDialogClose()
            setAlert('Category Updated Successfully!', 'success')
            setRefresh(!refresh)
        }).catch((error) => {
            setAlert(error.message, 'error')
            handleConfirmationDialogClose()
        })
    };

    const CategorySchema = Yup.object().shape({
        category: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
        // password: Yup.string().required('Password is required'),
    });

    const defaultValues = location.state

    const methods = useForm({
        resolver: yupResolver(CategorySchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async () => {
        const data = methods.getValues()
        setUpdatedData(data)
        if (!(checkGivenCategoryNameAlreadyExist(data))) {
            handleConfirmationDialogOpen()
        }
    }
    return (
        <Page title="Update Category">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Update Category
                    </Typography>
                    <Button component={RouterLink} to="/dashboard/categories" variant="contained">
                        View Categories
                    </Button>
                </Stack>

                <Card style={{ padding: "14px" }}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <RHFTextField required name="category" label="Category Name" />
                                <RHFDropDown
                                    id="status"
                                    name="status"
                                    label="Select Status"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                >
                                    <MenuItem value="">Select Status</MenuItem>
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
                                required
                            >
                                <MenuItem value="0">Root Category</MenuItem>
                                {
                                    categoryList.map((item, index) => (
                                        <MenuItem key={index} value={item._id} > {item.categoryHierarchy}</MenuItem>)
                                    )
                                }
                            </RHFDropDown>

                            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Update Category
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
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure "}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Performing this action will insert current changes and previous changes will be lost forever.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                    <Button onClick={handleUpdateCategory} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Page >
    )
}

export default UpdateCategory