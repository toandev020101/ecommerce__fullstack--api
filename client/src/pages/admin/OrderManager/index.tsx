import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import {
  BiDetail as BiDetailIcon,
  BiEdit as BiEditIcon,
  BiSearchAlt as BiSearchAltIcon,
  BiTrashAlt as BiTrashAltIcon,
} from 'react-icons/bi';
import {
  FiChevronDown as FiChevronDownIcon,
  FiChevronUp as FiChevronUpIcon,
  FiPlusSquare as FiPlusSquareIcon,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as orderApi from '../../../apis/orderApi';
import * as orderStatusApi from '../../../apis/orderStatusApi';
import { useAppDispatch } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import { HeadCell } from '../../../interfaces/HeadCell';
import { Order } from '../../../models/Order';
import { OrderStatus } from '../../../models/OrderStatus';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import { dateToString } from '../../../utils/date';
import { priceFormat } from '../../../utils/format';

const OrderManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const theme: Theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [statusArr, setStatusArr] = useState<OrderStatus[]>([]);
  const [statusId, setStatusId] = useState<string>('');

  const [rows, setRows] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [sort, setSort] = useState<string>('id');

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number>(-1);
  const [reload, setReload] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedArr, setSelectedArr] = useState<number[]>([]);

  const headCells: readonly HeadCell[] = [
    {
      label: 'Mã đơn',
      key: 'id',
      numeric: false,
      width: 120,
    },
    {
      label: 'Tên khách hàng',
      key: 'fullName',
      numeric: false,
      width: 200,
    },
    {
      label: 'Số điện thoại',
      key: 'phoneNumber',
      numeric: false,
      width: 150,
    },
    {
      label: 'Tổng số lượng',
      key: 'totalQuantity',
      numeric: false,
      width: 150,
    },
    {
      label: 'Thành tiền',
      key: 'totalPrice',
      numeric: false,
      width: 150,
    },
    {
      label: 'Trạng thái',
      key: 'orderStatusId',
      numeric: false,
      width: 200,
    },
    {
      label: 'Ngày tạo',
      key: 'createdAt',
      numeric: false,
      width: 120,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  // lấy query params
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    if (queryParams._page) {
      const _page = parseInt(queryParams._page as string);
      setPage(_page);
    }

    if (queryParams._limit) {
      const _limit = parseInt(queryParams._limit as string);
      setRowsPerPage(_limit);
    }

    if (queryParams._sort) {
      setSort(queryParams._sort as string);
    }

    if (queryParams._order) {
      const _order = (queryParams._order as string).toLowerCase() as 'asc' | 'desc';
      setOrder(_order);
    }

    if (queryParams.status) {
      setStatusId(queryParams.status as string);
    }

    if (queryParams.searchTerm) {
      setSearchTerm(queryParams.searchTerm as string);
    }
  }, [location]);

  useEffect(() => {
    // bỏ chọn nếu lấy lại danh sách rows
    setSelectedArr([]);

    // update url
    if (location.search) {
      const queryParams = queryString.parse(location.search);
      queryParams._page = page.toString();
      queryParams._limit = rowsPerPage.toString();
      queryParams._sort = sort;
      queryParams._order = order;
      queryParams.statusId = statusId;
      queryParams.searchTerm = searchTerm;

      const newUrl = location.pathname + '?' + queryString.stringify(queryParams);
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const getPaginationOrder = async () => {
      setIsLoading(true);
      try {
        const res = await orderApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          _sort: sort,
          _order: order,
          statusId,
          searchTerm,
        });

        const resData = res.data as Order[];
        if (resData.length === 0 && page > 0) {
          setPage(page - 1);
        }

        setRows(resData);
        setTotal(res.pagination?._total as number);
        setIsLoading(false);
      } catch (error: any) {
        const { data } = error.response;
        setIsLoading(false);
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getPaginationOrder();
  }, [
    dispatch,
    navigate,
    order,
    page,
    rowsPerPage,
    sort,
    reload,
    statusId,
    searchTerm,
    location.search,
    location.pathname,
  ]);

  useEffect(() => {
    const getAllOrderStatus = async () => {
      try {
        const res = await orderStatusApi.getAll();
        setStatusArr(res.data as OrderStatus[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllOrderStatus();
  }, [navigate]);

  const handleSortClick = (key: string, type?: 'asc' | 'desc') => {
    setSort(key);
    setOrder(order ? (order === 'asc' ? 'desc' : 'asc') : (type as 'asc' | 'desc'));
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedArr = rows.map((row) => row.id);
      setSelectedArr(newSelectedArr);
      return;
    }
    setSelectedArr([]);
  };

  const handleRowClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selectedArr.indexOf(id);
    let newSelectedArr: number[] = [];

    if (selectedIndex === -1) {
      newSelectedArr = newSelectedArr.concat(selectedArr, id);
    } else if (selectedIndex === 0) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(1));
    } else if (selectedIndex === selectedArr.length - 1) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(0, selectedIndex), selectedArr.slice(selectedIndex + 1));
    }
    setSelectedArr(newSelectedArr);
  };

  const isSelected = (id: number) => selectedArr.indexOf(id) !== -1;

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRowIndex = (index: number) => {
    setDeleteRowIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRow = async () => {
    try {
      let res: BaseResponse;
      if (deleteRowIndex === -1) {
        res = await orderApi.removeAny(selectedArr);
      } else {
        res = await orderApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'order',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'orderId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'order',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'orderId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleStatusFilter = (e: SelectChangeEvent) => {
    setStatusId(e.target.value as string);
    setPage(0);
  };

  const handleStatusChange = async (e: SelectChangeEvent, index: number) => {
    const id = rows[index].id;
    const orderStatusId = parseInt(e.target.value);

    try {
      const res = await orderApi.changeStatus(id, { orderStatusId });
      dispatch(
        showToast({
          page: 'order',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'orderId' },
        }),
      );

      rows[index].orderStatusId = orderStatusId;
      setRows([...rows]);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'order',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'orderId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  return (
    <>
      <TitlePage title="Danh sách đơn hàng" />
      <ToastNotify name="order" />

      {/* list content */}
      <Box
        padding="20px"
        marginBottom="30px"
        sx={{
          bgcolor: theme.palette.neutral[1000],
          boxShadow: `${theme.palette.neutral[700]} 0px 2px 10px 0px`,
          borderRadius: '5px',

          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary[500],
              fontSize: '16px',
            },
          },
          '& label.Mui-focused': {
            color: theme.palette.primary[500],
            fontSize: '16px',
          },

          '& .MuiSwitch-switchBase.Mui-checked': {
            color: theme.palette.primary[500],
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: theme.palette.primary[500],
          },
        }}
      >
        {/* header list */}
        <Box display="flex" justifyContent="space-between" marginBottom="20px">
          {/* left */}
          <Box display="flex" alignItems="center" gap="10px">
            {/* select */}
            <FormControl size="small" sx={{ minWidth: '200px' }}>
              <InputLabel id="select-active" sx={{ fontSize: '15px' }}>
                Chọn trạng thái
              </InputLabel>
              <Select
                labelId="select-active"
                id="select"
                value={statusId}
                label="Chọn trạng thái"
                onChange={handleStatusFilter}
                sx={{ fontSize: '15px' }}
              >
                <MenuItem value="">Chọn trạng thái</MenuItem>
                {statusArr.map((statusItem, index) => (
                  <MenuItem key={`status-item-${index}`} value={statusItem.id}>
                    {statusItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* select */}

            {/* export pdf bill */}

            {/* export pdf bill */}

            {selectedArr.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<BiTrashAltIcon />}
                onClick={() => handleDeleteRowIndex(-1)}
              >
                Xóa ({selectedArr.length})
              </Button>
            )}
          </Box>
          {/* left */}

          {/* right */}
          <Box display="flex" gap="10px" alignItems="center">
            <TextField
              id="outlined-basic"
              label="Tìm kiếm đơn hàng"
              variant="outlined"
              size="small"
              sx={{ width: '250px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <BiSearchAltIcon fontSize="20px" />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <Link to="/quan-tri/don-hang/danh-sach/them-moi">
              <Button
                variant="contained"
                startIcon={<FiPlusSquareIcon />}
                sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
              >
                Thêm mới
              </Button>
            </Link>
          </Box>
          {/* right */}
        </Box>
        {/* header list */}

        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 500,
            }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedArr.length > 0 && selectedArr.length < rows.length}
                    checked={rows.length > 0 && selectedArr.length === rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                    sx={{
                      color: theme.palette.primary[500],
                      '&.Mui-checked': {
                        color: theme.palette.primary[400],
                      },
                    }}
                  />
                </TableCell>

                {headCells.map((headCell, index) => (
                  <TableCell
                    key={`header-cell-${index}`}
                    align={headCell.numeric ? 'right' : 'left'}
                    sx={{ fontSize: '14px' }}
                    width={headCell.width}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      sx={{
                        '&:hover  > div': {
                          opacity: 1,
                          visibility: 'visible',
                        },
                      }}
                    >
                      <Typography fontWeight={500}>{headCell.label}</Typography>
                      {headCell.key && (
                        <Box
                          display="flex"
                          flexDirection="column"
                          sx={{
                            cursor: 'pointer',
                            opacity: sort === headCell.key ? 1 : 0,
                            visibility: sort === headCell.key ? 'visible' : 'hidden',
                          }}
                        >
                          {order && sort === headCell.key ? (
                            order === 'asc' ? (
                              <FiChevronUpIcon onClick={() => handleSortClick(headCell.key as string)} />
                            ) : (
                              <FiChevronDownIcon onClick={() => handleSortClick(headCell.key as string)} />
                            )
                          ) : (
                            <>
                              <FiChevronUpIcon onClick={() => handleSortClick(headCell.key as string, 'asc')} />
                              <FiChevronDownIcon onClick={() => handleSortClick(headCell.key as string, 'desc')} />
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <>
                  {/* loading table content */}
                  {Array(rowsPerPage)
                    .fill(0)
                    .map((_row, index) => (
                      <TableRow key={`table-${index}`}>
                        <TableCell>
                          <Skeleton variant="rounded" animation="wave" width="18px" height="18px">
                            <Checkbox />
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Mã đơn hàng</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Tên khách hàng</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Số điện thoại</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Địa chỉ</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Số lượng sản phẩm</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Thành tiền</Typography>
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Select
                              labelId="select-active"
                              id="select"
                              value="status"
                              label="Chọn trạng thái"
                              sx={{ fontSize: '15px' }}
                            >
                              <MenuItem value="">Chọn trạng thái</MenuItem>
                            </Select>
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Ngày tạo</Typography>
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" gap="10px">
                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BiDetailIcon />
                              </IconButton>
                            </Skeleton>

                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BiEditIcon />
                              </IconButton>
                            </Skeleton>

                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BiTrashAltIcon />
                              </IconButton>
                            </Skeleton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  {/* loading table content */}
                </>
              ) : (
                <>
                  {/* table content */}
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        key={`table-${row.id}`}
                        hover
                        onClick={(event) => handleRowClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        tabIndex={-1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                            sx={{
                              color: theme.palette.primary[500],
                              '&.Mui-checked': {
                                color: theme.palette.primary[400],
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>#{row.id}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.fullName}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.phoneNumber}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.totalQuantity}</TableCell>
                        <TableCell sx={{ fontSize: '14px', fontWeight: 500, color: theme.palette.error.main }}>
                          {priceFormat(row.totalPrice)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <FormControl size="small" fullWidth onClick={(e: any) => e.stopPropagation()}>
                            <InputLabel id="select-active" sx={{ fontSize: '15px' }}>
                              Trạng thái
                            </InputLabel>
                            <Select
                              labelId="select-active"
                              id="select"
                              value={row.orderStatusId.toString()}
                              label="Trạng thái"
                              onChange={(e: SelectChangeEvent) => handleStatusChange(e, index)}
                              sx={{ fontSize: '15px' }}
                            >
                              {statusArr.map((statusItem, idx) => (
                                <MenuItem
                                  key={`status-item-${idx}`}
                                  value={statusItem.id}
                                  disabled={statusItem.isShip === 1}
                                >
                                  {statusItem.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{dateToString(row.createdAt, 1)}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            <Tooltip title="Sửa">
                              <Link to={`/quan-tri/don-hang/danh-sach/chinh-sua/${row.id}`}>
                                <IconButton>
                                  <BiEditIcon style={{ color: theme.palette.warning.main }} />
                                </IconButton>
                              </Link>
                            </Tooltip>

                            <Tooltip title="Xóa">
                              <IconButton
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  handleDeleteRowIndex(index);
                                }}
                              >
                                <BiTrashAltIcon style={{ color: theme.palette.error.main }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {rows.length === 0 && (
                    <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={headCells.length + 1} align="center" sx={{ fontSize: '14px' }}>
                        Không có dữ liệu nào!
                      </TableCell>
                    </TableRow>
                  )}
                  {/* table content */}
                </>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: total > 0 ? total : -1 }]}
                  colSpan={headCells.length + 1}
                  count={total > 0 ? total : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'Rows per page:',
                    },
                    native: true,
                  }}
                  labelRowsPerPage="Số hàng trên mỗi trang"
                  labelDisplayedRows={({ from, to }) => `${from}–${to} / ${total}`}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
            Xác nhận xóa đơn hàng
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1 ? selectedArr.length + ' đơn hàng này' : `đơn hàng "#${rows[deleteRowIndex]?.id}"`}{' '}
              hay không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                handleDeleteDialogClose();
                handleDeleteRow();
              }}
            >
              Xác nhận
            </Button>
            <Button variant="outlined" onClick={handleDeleteDialogClose} color="error">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* list content */}
    </>
  );
};

export default OrderManager;
