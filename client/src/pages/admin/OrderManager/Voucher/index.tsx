import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
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
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon, BiSearchAlt as BiSearchAltIcon, BiTrashAlt as BiTrashAltIcon } from 'react-icons/bi';
import {
  FiChevronDown as FiChevronDownIcon,
  FiChevronUp as FiChevronUpIcon,
  FiPlusSquare as FiPlusSquareIcon,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as couponApi from '../../../../apis/couponApi';
import { useAppDispatch } from '../../../../app/hook';
import InputField from '../../../../components/InputField';
import SelectField from '../../../../components/SelectField';
import TitlePage from '../../../../components/TitlePage';
import ToastNotify from '../../../../components/ToastNotify';
import { BaseResponse } from '../../../../interfaces/BaseResponse';
import { CouponInput } from '../../../../interfaces/CouponInput';
import { FieldError } from '../../../../interfaces/FieldError';
import { HeadCell } from '../../../../interfaces/HeadCell';
import { Coupon } from '../../../../models/Coupon';
import { showToast } from '../../../../slices/toastSlice';
import { Theme } from '../../../../theme';
import { dateToString, toDateString } from '../../../../utils/date';
import couponSchema from '../../../../validations/couponSchema';

const Voucher: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme: Theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Coupon[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [sort, setSort] = useState<string>('id');

  const [openAddOrEditIndexDialog, setOpenAddOrEditIndexDialog] = useState<number>(-2);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number>(-1);
  const [reload, setReload] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedArr, setSelectedArr] = useState<number[]>([]);

  const headCells: readonly HeadCell[] = [
    {
      label: 'Tên mã',
      key: 'name',
      numeric: false,
    },
    {
      label: 'Giá giảm tối đa',
      key: 'priceMaxName',
      numeric: false,
    },
    {
      label: 'Mã',
      key: 'code',
      numeric: false,
    },
    {
      label: 'Số lượng',
      key: 'quantity',
      numeric: false,
    },
    {
      label: 'Ngày bắt đầu',
      key: 'startDate',
      numeric: false,
    },
    {
      label: 'Ngày kết thúc',
      key: 'endDate',
      numeric: false,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  const form = useForm<CouponInput>({
    defaultValues: {
      name: '',
      priceMaxName: '',
      code: '',
      discountValue: 0,
      priceMax: '',
      type: 0,
      quantity: 1,
      startDate: new Date(),
      endDate: new Date(),
    },
    resolver: yupResolver(couponSchema),
  });

  useEffect(() => {
    setIsLoading(true);
    // bỏ chọn nếu lấy lại danh sách rows
    setSelectedArr([]);

    const getPaginationCoupon = async () => {
      try {
        const res = await couponApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          _sort: sort,
          _order: order,
          searchTerm,
        });

        const resData = res.data as Coupon[];
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

    getPaginationCoupon();
  }, [dispatch, navigate, order, page, rowsPerPage, sort, reload, searchTerm]);

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

  const handleOpenAddDialog = () => {
    setOpenAddOrEditIndexDialog(-1);
    form.reset({
      name: '',
      priceMaxName: '',
      code: '',
      discountValue: 0,
      priceMax: '',
      type: 0,
      quantity: 1,
      startDate: toDateString(new Date()),
      endDate: toDateString(new Date()),
    });
  };

  const handleOpenEditDialog = (e: any, index: number) => {
    e.stopPropagation();
    setOpenAddOrEditIndexDialog(index);
    form.reset({
      name: rows[index].name,
      priceMaxName: rows[index].priceMaxName ? rows[index].priceMaxName : '',
      code: rows[index].code,
      discountValue: rows[index].discountValue,
      priceMax: rows[index].priceMax ? rows[index].priceMax : 0,
      type: rows[index].type,
      quantity: rows[index].quantity,
      startDate: toDateString(rows[index].startDate),
      endDate: toDateString(rows[index].endDate),
    });
  };

  const handleAddOrEditDialogClose = () => {
    setOpenAddOrEditIndexDialog(-2);
    setErrors([]);
  };

  const handleAddOrEditSubmit = async (values: any) => {
    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = null;
      }
    }

    try {
      let res: BaseResponse;
      if (openAddOrEditIndexDialog !== -1) {
        res = await couponApi.updateOne(rows[openAddOrEditIndexDialog].id, values);
      } else {
        res = await couponApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'voucher',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'voucherId' },
        }),
      );
      setOpenAddOrEditIndexDialog(-2);
      setReload(!reload);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 403) {
        if (data.code === 400) {
          setErrors(data.errors);
        }

        dispatch(
          showToast({
            page: 'voucher',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'voucherId' },
          }),
        );
        setOpenAddOrEditIndexDialog(-2);
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setErrors([]);
  };

  const handleDeleteRowIndex = (index: number) => {
    setDeleteRowIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRow = async () => {
    try {
      let res: BaseResponse;
      if (deleteRowIndex === -1) {
        res = await couponApi.removeAny(selectedArr);
      } else {
        res = await couponApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'voucher',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'voucherId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'voucher',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'voucherId' },
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
      <TitlePage title="Danh sách mã giảm giá" />
      <ToastNotify name="voucher" />

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
          <Box display="flex" alignItems="center" gap="20px">
            <TextField
              id="outlined-basic"
              label="Tìm kiếm mã giảm giá"
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
          <Button
            variant="contained"
            startIcon={<FiPlusSquareIcon />}
            sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
            onClick={handleOpenAddDialog}
          >
            Thêm mới
          </Button>
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
                            <Typography>Tên mã</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Giá giảm tối đa</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Mã</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Số lượng</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Ngày bắt đầu</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Ngày kết thúc</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap="10px">
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
                        key={`table-${index}`}
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
                        <TableCell sx={{ fontSize: '14px' }}>{row.name}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.priceMaxName ? row.priceMaxName : '--'}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.code}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.quantity}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{dateToString(row.startDate)}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{dateToString(row.endDate)}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            <Tooltip title="Sửa">
                              <IconButton onClick={(e: any) => handleOpenEditDialog(e, index)}>
                                <BiEditIcon style={{ color: theme.palette.warning.main }} />
                              </IconButton>
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
            Xác nhận xóa mã giảm giá
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1
                ? selectedArr.length + ' mã giảm giá này'
                : `mã giảm giá "${rows[deleteRowIndex]?.name}"`}{' '}
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

      {/* add or edit dialog */}
      <Dialog
        open={openAddOrEditIndexDialog !== -2}
        onClose={handleAddOrEditDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
          {openAddOrEditIndexDialog === -1 ? 'Thêm mới' : 'Chỉnh sửa'} mã giảm giá
        </DialogTitle>
        <DialogContent sx={{ width: '600px' }}>
          <Box component="form" onSubmit={form.handleSubmit(handleAddOrEditSubmit)} margin="10px 0">
            <Box display="flex" gap="10px">
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="name"
                label="Tên mã"
                required
              />
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="priceMaxName"
                label="Tên giá giảm tối đa"
              />
            </Box>

            <Box display="flex" gap="10px">
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="code"
                label="Mã"
                required
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="discountValue"
                label="Giá trị giảm"
                required
                type="number"
                inputProps={{ min: 1 }}
              />
            </Box>

            <Box display="flex" gap="10px">
              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="type"
                label="Kiểu mã"
                valueObjects={[
                  {
                    label: 'VNĐ',
                    value: 0,
                  },
                  {
                    label: '%',
                    value: 1,
                  },
                ]}
                required
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="priceMax"
                label="Giá giảm tối đa"
              />
            </Box>

            <Box display="flex" gap="10px">
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="startDate"
                label="Ngày bắt đầu ưu đãi"
                type="date"
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="endDate"
                label="Ngày kết thúc ưu đãi"
                type="date"
              />
            </Box>

            <InputField
              form={form}
              errorServers={errors}
              setErrorServers={setErrors}
              name="quantity"
              label="Số lượng"
              required
              type="number"
              inputProps={{ min: 0 }}
            />

            <Box display="flex" justifyContent="flex-end" gap="10px" marginTop="20px">
              <Button variant="outlined" type="submit">
                {openAddOrEditIndexDialog === -1 ? 'Thêm mới' : 'Chỉnh sửa'}
              </Button>
              <Button variant="outlined" onClick={handleAddOrEditDialogClose} color="error">
                Hủy
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {/* add or edit dialog */}
    </>
  );
};

export default Voucher;
