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

function UpdatePackage() {
    const { setAlert } = useAlert();
    const location = useLocation();
    const { id } = useParams()
    const [ConfirmationDialog, setConfirmationDialog] = useState(false);
    const [updatedData, setUpdatedData] = useState({});

    console.log(location.state)


    const handleConfirmationDialogOpen = () => {
        setConfirmationDialog(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialog(false);
    };

    const handleUpdatePackage = () => {
        axios({
            method: "PUT",
            url: `${baseUrl}/api/v1/admin/update-package/${id}`,
            data: updatedData,
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            handleConfirmationDialogClose()
            setAlert('Package Updated Successfully!', 'success')
        }).catch((error) => {
            setAlert(error.message, 'error')
            handleConfirmationDialogClose()
        })
    };

    const PackageSchema = Yup.object().shape({
        packageName: Yup.string().min(2, 'must be atleast 4 characters').required('Email is required'),
        packagePrice: Yup.number().min(0, 'must be a positive value').required('Price is required'),
        packageDuration: Yup.string().required('Duration is required'),
        packageFeatures: Yup.array().required('Features are required'),
        status: Yup.string().required('please select a status'),
    });

    const defaultValues = location.state

    const methods = useForm({
        resolver: yupResolver(PackageSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async () => {
        const data = methods.getValues()
        setUpdatedData(data)
        handleConfirmationDialogOpen()
    }
    return (
        <Page title="Add Packages">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        update Package
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

                            <RHFMultiSelect options={[]} defaultValue={defaultValues.packageFeatures} name="packageFeatures" label="Package Features" />

                            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                Update Package
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
                    <Button onClick={handleUpdatePackage} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Page >
    )
}

export default UpdatePackage