import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
} from '@mui/material';
import { baseUrl } from '../../core';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user';
import useAlert from '../../hooks/useAlert';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'parentCategoryName', label: 'Parent Category', alignRight: false },
  // { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'isPaid', label: 'Is Paid', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (categories) => categories.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ContentData() {
  const { setAlert } = useAlert();

  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);

  const [ConfirmationDialog, setConfirmationDialog] = useState(false);

  const [currentContentId, setCurrentContentId] = useState('');

  const [refresh, setRefresh] = useState(false);

  const [loader, setLoader] = useState(true);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-content-data`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        getCategoriesListAndSetParentCategoryName(res.data.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [refresh]);

  useEffect(() => {
    updateHome();
  }, []);

  const updateHome = () => {
    axios({
      method: 'POST',
      url: `${baseUrl}/api/v1/admin/update-home`,
      withCredentials: true,
    })
      .then((res) => {
        console.log('ContentDataHome', res);
      })
      .catch((error) => {
        console.log('error', error);
      });

    //   const token =
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzMDYxZDRkNjkzNTI5YmY3NzU0OGFlNiIsImVtYWlsIjoibWFuYWdlckBzaWRhdC5uZXQiLCJuYW1lIjoiQWRtaW4ifSwiaWF0IjoxNjY5NDg1MjI4fQ.oTP3-HTwkhRblj6Esh9b7I62G2OHue5GD5OFxtD6vA0';

    //   axios
    //     .post(`${baseUrl}/api/v1/admin/update-home`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((res) => {
    //       console.log('ContentDataHome', res);
    //     })
    //     .catch((error) => {
    //       console.log('ContentDataHomeError', error);
    //     });
  };

  const getCategoriesListAndSetParentCategoryName = (data) => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-content-details`,
      withCredentials: true,
    })
      .then((res) => {
        const list = [];
        const categoryList = res.data.data;

        data.forEach((item) => {
          const obj = categoryList.find((i) => item.categoryId === i._id);
          console.log('obj', obj);
          item.parentCategoryName = obj?.name;
          list.push(item);
        });

        console.log(list);
        setCategoryList(list);
        setLoader(false);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleDeleteContent = () => {
    axios({
      method: 'DELETE',
      url: `${baseUrl}/api/v1/admin/delete-content-data/${currentContentId}`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        setRefresh(!refresh);
        setConfirmationDialog(false);
        setAlert('Content Deleted Successfully!', 'error');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleClickName = (item) => {
    navigate(`/dashboard/update-content-data/${item._id}`, { state: item });
  };

  const handleConfirmationDialogOpen = (id) => {
    setCurrentContentId(id);
    setConfirmationDialog(true);
  };

  const handleConfirmationDialogClose = () => {
    setCurrentContentId('');
    setConfirmationDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categoryList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    // console.log(event.target.value)
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categoryList.length) : 0;

  const filteredUsers = applySortFilter(categoryList, getComparator(order, orderBy), filterName);

  const isContentNotFound = filteredUsers.length === 0;

  return (
    <Page title="Content Data">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Content Data
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/add-content-data"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Content Data
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={categoryList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, title: name, status, isPaid, parentCategoryName, avatarUrl } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none" onClick={() => handleClickName(row)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{parentCategoryName}</TableCell>

                        {/* <TableCell align="left">{role}</TableCell> */}
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        <TableCell align="left">
                          <Label variant="ghost" color={(status === 'inactive' && 'primary') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{isPaid}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu item={row} page="content-data" deleteHandler={handleConfirmationDialogOpen} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isContentNotFound && filterName && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {loader ? (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        Loading.....
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  categoryList.length === 0 && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          No Data Found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={categoryList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
            Performing this action will delete selected content.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteContent} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
