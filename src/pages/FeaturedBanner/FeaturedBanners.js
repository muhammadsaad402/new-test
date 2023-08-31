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
  Box,
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
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'clickType', label: 'Click Type', alignRight: false },
  { id: 'order', label: 'Order', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
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

export default function FeatureBanners() {
  const { setAlert } = useAlert();

  const navigate = useNavigate();

  const [bannerList, setBannerList] = useState([]);

  const [ConfirmationDialog, setConfirmationDialog] = useState(false);

  const [currentCategoryId, setCurrentCategoryId] = useState('');

  const [refresh, setRefresh] = useState(false);

  const [loader, setLoader] = useState(true);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getBannerList();

    // eslint-disable-next-line
  }, [refresh]);

  const getBannerList = () => {
    axios({
      method: 'GET',
      url: `${baseUrl}/api/v1/admin/get-featured-banners`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        // const sortedData = res.data.data.sort((a, b) => b.order - a.order);
        setBannerList(res.data.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleDeleteContent = () => {
    axios({
      method: 'DELETE',
      url: `${baseUrl}/api/v1/admin/delete-featured-banner/${currentCategoryId}`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        setRefresh(!refresh);
        setConfirmationDialog(false);
        setAlert('Banner Deleted Successfully!', 'error');
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleClickName = (item) => {
    navigate(`/dashboard/update-featured-banner/${item._id}`, { state: item });
  };

  const handleMoveUp = (banner) => {
    const tempBannerList = [];

    const indexOfCurrentBanner = bannerList.findIndex((item) => item._id === banner._id);

    if (indexOfCurrentBanner > 0) {
      // eslint-disable-next-line
      banner.order = banner.order + 1;

      const tempBanner = bannerList[indexOfCurrentBanner - 1];

      // eslint-disable-next-line
      tempBanner.order = tempBanner.order - 1;

      tempBannerList.push(banner, tempBanner);
    } else {
      alert('You can not move up');
      return;
    }

    console.log(tempBannerList);

    tempBannerList.forEach((item) => {
      handleUpdateBanner(item);
    });
    setRefresh(!refresh);
    // setAlert('Banner Moved Up Successfully!', 'error')
  };

  const handleMoveDown = (banner) => {
    const tempBannerList = [];

    const indexOfCurrentBanner = bannerList.findIndex((item) => item._id === banner._id);

    if (indexOfCurrentBanner !== bannerList.length - 1) {
      // eslint-disable-next-line
      banner.order = banner.order - 1;

      const tempBanner = bannerList[indexOfCurrentBanner + 1];

      // eslint-disable-next-line
      tempBanner.order = tempBanner.order + 1;

      tempBannerList.push(banner, tempBanner);
    } else {
      alert('You can not move down');
      return;
    }

    console.log(tempBannerList);

    tempBannerList.forEach((item) => {
      handleUpdateBanner(item);
    });
    setRefresh(!refresh);
    // setAlert('Banner Moved Down Successfully!', 'error')
  };

  const handleUpdateBanner = (item) => {
    console.log('item', item);
    axios({
      method: 'PUT',
      url: `${baseUrl}/api/v1/admin/update-featured-banner/${item._id}`,
      withCredentials: true,
      data: item,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleConfirmationDialogOpen = (id) => {
    setCurrentCategoryId(id);
    setConfirmationDialog(true);
  };

  const handleConfirmationDialogClose = () => {
    setCurrentCategoryId('');
    setConfirmationDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bannerList.map((n) => n.name);
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
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bannerList.length) : 0;

  const filteredUsers = applySortFilter(bannerList, getComparator(order, orderBy), filterName);

  const isContentNotFound = filteredUsers.length === 0;

  return (
    <Page title="Featured Banners">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Featured Banners
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/add-featured-banner"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Featured Banner
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
                  rowCount={bannerList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, title: name, status, type, clickType, avatarUrl, order } = row;
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
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">{clickType}</TableCell>
                        <TableCell align="left">{order}</TableCell>

                        {/* <TableCell align="left">{role}</TableCell> */}
                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        <TableCell align="left">
                          <Label variant="ghost" color={(status === 'inactive' && 'primary') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <TableCell align="left">
                          <Stack direction="column" alignItems="center" spacing={0}>
                            <Box
                              onClick={() => handleMoveUp(row)}
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              <Iconify icon={'akar-icons:chevron-up'} width={22} height={22} />
                            </Box>
                            <Box
                              onClick={() => handleMoveDown(row)}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignitems: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Iconify icon={'akar-icons:chevron-down'} width={22} height={22} />
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            item={row}
                            page="featured-banner"
                            deleteHandler={handleConfirmationDialogOpen}
                          />
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
                  bannerList.length === 0 && (
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
            count={bannerList.length}
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
            Performing this action will make selected banner Inactive.
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
