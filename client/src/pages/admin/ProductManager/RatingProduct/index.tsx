import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  SelectChangeEvent,
  Skeleton,
  Switch,
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
import React, { ChangeEvent, useEffect, useState } from 'react';
import { BiEdit as BiEditIcon, BiSearchAlt as BiSearchAltIcon, BiTrashAlt as BiTrashAltIcon } from 'react-icons/bi';
import {
  FiChevronDown as FiChevronDownIcon,
  FiChevronUp as FiChevronUpIcon,
  FiPlusSquare as FiPlusSquareIcon,
} from 'react-icons/fi';
import { BsReplyAll as BsReplyAllIcon } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as reviewApi from '../../../../apis/reviewApi';
import { useAppDispatch } from '../../../../app/hook';
import TitlePage from '../../../../components/TitlePage';
import ToastNotify from '../../../../components/ToastNotify';
import { BaseResponse } from '../../../../interfaces/BaseResponse';
import { HeadCell } from '../../../../interfaces/HeadCell';
import { Review } from '../../../../models/Review';
import { showToast } from '../../../../slices/toastSlice';
import { Theme } from '../../../../theme';
import { dateToString } from '../../../../utils/date';
import { ReviewInput } from '../../../../interfaces/ReviewInput';
import reviewSchema from '../../../../validations/reviewSchema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../../../components/InputField';
import { FieldError } from '../../../../interfaces/FieldError';

const RatingProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const theme: Theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<string>('');

  const [rows, setRows] = useState<Review[]>([]);
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

  const [openAddOrEditIndexDialog, setOpenAddOrEditIndexDialog] = useState<number>(-2);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const headCells: readonly HeadCell[] = [
    {
      label: 'ID',
      numeric: false,
      width: 50,
    },
    {
      label: 'Tác giả',
      numeric: false,
      width: 180,
    },
    {
      label: 'Sản phẩm',
      numeric: false,
      width: 220,
    },
    {
      label: 'Đánh giá',
      key: 'ratingValue',
      numeric: false,
      width: 140,
    },
    {
      label: 'Nội dung',
      key: 'comment',
      numeric: false,
      width: 250,
    },
    {
      label: 'Phê duyệt',
      key: 'status',
      numeric: false,
      width: 130,
    },
    {
      label: 'Ngày tạo',
      key: 'createdAt',
      numeric: false,
      width: 120,
    },
    {
      label: 'Phản hồi',
      numeric: false,
      width: 100,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  const form = useForm<ReviewInput>({
    defaultValues: {
      ratingValue: 0,
      orderLinedId: 1,
      comment: '',
      images: [],
      type: 1,
      status: 1,
      reviewId: 0,
    },
    resolver: yupResolver(reviewSchema),
  });

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
      setStatus(queryParams.status as string);
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
      queryParams.status = status;
      queryParams.searchTerm = searchTerm;

      const newUrl = location.pathname + '?' + queryString.stringify(queryParams);
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const getPaginationReview = async () => {
      setIsLoading(true);
      try {
        const res = await reviewApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          _sort: sort,
          _order: order,
          status,
          searchTerm,
        });

        const resData = res.data as Review[];
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

    getPaginationReview();
  }, [
    dispatch,
    navigate,
    order,
    page,
    rowsPerPage,
    sort,
    reload,
    status,
    searchTerm,
    location.search,
    location.pathname,
  ]);

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
        res = await reviewApi.removeAny(selectedArr);
      } else {
        res = await reviewApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'rating',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'ratingId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'rating',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'ratingId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleStatusFilter = (e: SelectChangeEvent) => {
    setStatus(e.target.value as string);
    setPage(0);
  };

  const handleStatusChange = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const id = rows[index].id;
    const newStatus = e.target.checked ? 1 : 0;

    try {
      const res = await reviewApi.changeStatus(id, newStatus);
      dispatch(
        showToast({
          page: 'rating',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'ratingId' },
        }),
      );

      rows[index].status = newStatus;
      setRows([...rows]);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'rating',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'ratingId' },
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

  const handleOpenAddDialog = (e: any, index: number) => {
    e.stopPropagation();
    setOpenAddOrEditIndexDialog(-1);
    form.reset({
      ratingValue: 0,
      orderLinedId: rows[index].orderLinedId,
      comment: '',
      images: [],
      type: 1,
      status: 1,
      reviewId: rows[index].id,
    });
  };

  const handleOpenEditDialog = (e: any, index: number) => {
    e.stopPropagation();
    setOpenAddOrEditIndexDialog(index);
    form.reset({
      ratingValue: 0,
      orderLinedId: rows[index].orderLinedId,
      comment: rows[index].comment,
      images: [],
      type: 1,
      status: 1,
      reviewId: rows[index].id,
    });
  };

  const handleAddOrEditDialogClose = () => {
    setOpenAddOrEditIndexDialog(-2);
    setErrors([]);
  };

  const handleAddOrEditReplySubmit = async (values: any) => {
    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = null;
      }
    }

    try {
      let res: BaseResponse;
      if (openAddOrEditIndexDialog !== -1) {
        res = await reviewApi.updateOne(rows[openAddOrEditIndexDialog].id, values);
      } else {
        res = await reviewApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'rating',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'ratingId' },
        }),
      );
      setOpenAddOrEditIndexDialog(-2);
      setReload(!reload);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'rating',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'ratingId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage title="Danh sách đánh giá" />
      <ToastNotify name="rating" />

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
                value={status}
                label="Chọn trạng thái"
                onChange={handleStatusFilter}
                sx={{ fontSize: '15px' }}
              >
                <MenuItem value="">Chọn trạng thái</MenuItem>
                <MenuItem value="0">Chưa phê duyệt</MenuItem>
                <MenuItem value="1">Đã phê duyệt</MenuItem>
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
              label="Tìm kiếm đánh giá"
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

            <Link to="/quan-tri/san-pham/danh-gia/them-moi">
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
                            <Typography>ID</Typography>
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap="10px">
                            <Skeleton animation="wave" variant="circular">
                              <Avatar sx={{ width: 40, height: 40 }} />
                            </Skeleton>
                            <Box>
                              <Skeleton animation="wave" width="100%">
                                <Typography>Họ và tên</Typography>
                              </Skeleton>
                              <Skeleton animation="wave" width="100%">
                                <Typography>Tên đăng nhập</Typography>
                              </Skeleton>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap="10px">
                            <Skeleton animation="wave" width="100%">
                              <img src="" alt="" style={{ width: '40px', height: '40px' }} />
                            </Skeleton>
                            <Box>
                              <Skeleton animation="wave" width="100%">
                                <Typography>Tên sản phẩm</Typography>
                              </Skeleton>
                              <Skeleton animation="wave" width="100%">
                                <Typography>Thuộc tính sản phẩm</Typography>
                              </Skeleton>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Rating name="read-only" value={3} readOnly />
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Nội dung</Typography>
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
                          <Skeleton animation="wave" width="100%">
                            <Typography>Phản hồi</Typography>
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" gap="10px">
                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BsReplyAllIcon />
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
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Typography>{row.type === 0 ? `#${row.id}` : '--'}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" alignItems="center" gap="10px">
                            {row.user.avatar ? (
                              <Avatar src={row.user.avatar} sx={{ width: 40, height: 40 }} />
                            ) : (
                              <Avatar sx={{ width: 40, height: 40 }}>{row.user.fullName.charAt(0)}</Avatar>
                            )}
                            <Box>
                              <Typography variant="h6">{row.user.fullName}</Typography>
                              <Typography color={theme.palette.neutral[400]}>@{row.user.username}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" alignItems="center" gap="10px">
                            <img
                              src={row.orderLine.productItem.imageUrl}
                              alt={row.orderLine.productItem.product.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                border: ' 1px solid #e0e0e0',
                                borderRadius: '3px',
                              }}
                            />
                            <Box>
                              <Typography variant="h6">{row.orderLine.productItem.product.name}</Typography>
                              <Typography color={theme.palette.neutral[400]}>{row.orderLine.variation}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          {row.type === 0 ? <Rating name="read-only" value={row.ratingValue} readOnly /> : '--'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Typography>{row.comment}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                defaultChecked={row.status === 1}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleStatusChange(e, index)}
                              />
                            }
                            label=""
                            onClick={(e: any) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{dateToString(row.createdAt, 1)}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Typography>{row.type === 0 ? '--' : `#${row.reviewId}`}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex">
                            {row.type === 0 && (
                              <Tooltip title="Phản hồi">
                                <IconButton onClick={(e: any) => handleOpenAddDialog(e, index)}>
                                  <BsReplyAllIcon style={{ color: theme.palette.info.main }} />
                                </IconButton>
                              </Tooltip>
                            )}

                            {row.type === 0 ? (
                              <Tooltip title="Sửa">
                                <Link to={`/quan-tri/san-pham/danh-gia/chinh-sua/${row.id}`}>
                                  <IconButton>
                                    <BiEditIcon style={{ color: theme.palette.warning.main }} />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Sửa">
                                <IconButton onClick={(e: any) => handleOpenEditDialog(e, index)}>
                                  <BiEditIcon style={{ color: theme.palette.warning.main }} />
                                </IconButton>
                              </Tooltip>
                            )}

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
            Xác nhận xóa {rows[deleteRowIndex]?.type === 0 ? 'đánh giá' : 'phản hồi'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1
                ? selectedArr.length + ' đánh giá hoặc phản hồi này'
                : `${rows[deleteRowIndex]?.type === 0 ? 'đánh giá' : 'phản hồi'} "${
                    rows[deleteRowIndex]?.orderLine.productItem.product.name
                  } (${rows[deleteRowIndex]?.orderLine.variation})"`}{' '}
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

        {/* add or edit dialog */}
        <Dialog
          open={openAddOrEditIndexDialog !== -2}
          onClose={handleAddOrEditDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
            {openAddOrEditIndexDialog === -1 ? 'Thêm mới' : 'Chỉnh sửa'} phản hồi
          </DialogTitle>
          <DialogContent sx={{ width: '400px' }}>
            <Box component="form" onSubmit={form.handleSubmit(handleAddOrEditReplySubmit)} margin="10px 0">
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="comment"
                label="Nội dung"
                required
                multiline
                maxRows={4}
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
      </Box>
      {/* list content */}
    </>
  );
};

export default RatingProduct;
