import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
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
import React, { useEffect, useState } from 'react';
import { BiEdit as BiEditIcon, BiSearchAlt as BiSearchAltIcon, BiTrashAlt as BiTrashAltIcon } from 'react-icons/bi';
import {
  FiChevronDown as FiChevronDownIcon,
  FiChevronUp as FiChevronUpIcon,
  FiPlusSquare as FiPlusSquareIcon,
} from 'react-icons/fi';
import { IoMdImages as IoMdImagesIcon } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as categoryApi from '../../../../apis/categoryApi';
import TitlePage from '../../../../components/TitlePage';
import ToastNotify from '../../../../components/ToastNotify';
import { BaseResponse } from '../../../../interfaces/BaseResponse';
import { HeadCell } from '../../../../interfaces/HeadCell';
import { Category } from '../../../../models/Category';
import { showToast } from '../../../../slices/toastSlice';
import { Theme } from '../../../../theme';

const CategoryProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const theme: Theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rows, setRows] = useState<Category[]>([]);
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
      label: 'Tên danh mục',
      key: 'name',
      numeric: false,
      width: 300,
    },
    {
      label: 'Đường dẫn',
      key: 'slug',
      numeric: false,
      width: 300,
    },
    {
      label: 'Vị trí',
      key: 'level',
      numeric: false,
      width: 150,
    },
    {
      label: 'Danh mục cha',
      key: 'parentId',
      numeric: false,
      width: 200,
    },
    {
      label: 'Trạng thái',
      key: 'isActive',
      numeric: false,
      width: 200,
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

    if (queryParams.searchTerm) {
      setSearchTerm(queryParams.searchTerm as string);
    }
  }, [location]);

  useEffect(() => {
    // bỏ chọn nếu lấy lại danh sách
    setSelectedArr([]);

    // update url
    if (location.search) {
      const queryParams = queryString.parse(location.search);
      queryParams._page = page.toString();
      queryParams._limit = rowsPerPage.toString();
      queryParams._sort = sort;
      queryParams._order = order;
      queryParams.searchTerm = searchTerm;

      const newUrl = location.pathname + '?' + queryString.stringify(queryParams);
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const getPaginationCategory = async () => {
      setIsLoading(true);
      try {
        const res = await categoryApi.getPaginationAndParent({
          _limit: rowsPerPage,
          _page: page,
          _sort: sort,
          _order: order,
          searchTerm,
        });

        const resData = res.data as Category[];
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

    getPaginationCategory();
  }, [dispatch, navigate, order, page, rowsPerPage, sort, reload, searchTerm, location.search, location.pathname]);

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
        res = await categoryApi.removeAny(selectedArr);
      } else {
        res = await categoryApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'categoryProduct',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'categoryProductId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'categoryProduct',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'categoryProductId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleActiveChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const id = rows[index].id;
    const isActive = e.target.checked;

    try {
      const res = await categoryApi.changeActive(id, { isActive: isActive ? 1 : 0 });
      dispatch(
        showToast({
          page: 'categoryProduct',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'categoryProductId' },
        }),
      );

      rows[index].isActive = isActive ? 1 : 0;
      setRows([...rows]);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'categoryProduct',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'categoryProductId' },
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
      <TitlePage title="Danh sách danh mục" />
      <ToastNotify name="categoryProduct" />

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
              label="Tìm kiếm tài khoản"
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
          <Link to="/quan-tri/san-pham/danh-muc/them-moi">
            <Button
              variant="contained"
              startIcon={<FiPlusSquareIcon />}
              sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
            >
              Thêm mới
            </Button>
          </Link>
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
                          <Box display="flex" alignItems="center" gap="10px">
                            <Skeleton animation="wave" variant="rectangular">
                              <img
                                src=""
                                alt=""
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  border: '1px solid #ccc',
                                  borderRadius: '5px',
                                }}
                              />
                            </Skeleton>

                            <Skeleton animation="wave" width="100%">
                              <Typography>Tên danh mục</Typography>
                            </Skeleton>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Đường dẫn</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Vị trí</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Danh mục cha</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <FormControlLabel control={<Switch />} label={'Trạng thái'} />
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
                          <Box display="flex" alignItems="center" gap="10px">
                            {row.imageUrl ? (
                              <img
                                src={row.imageUrl}
                                alt={row.name}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  border: '1px solid #ccc',
                                  borderRadius: '5px',
                                }}
                              />
                            ) : (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                  width: '50px',
                                  height: '50px',
                                  border: '1px solid #ccc',
                                  borderRadius: '5px',
                                }}
                              >
                                <IoMdImagesIcon fontSize="30px" style={{ color: theme.palette.neutral[400] }} />
                              </Box>
                            )}

                            <Typography variant="h6">{row.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.slug}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.level}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.parent?.name}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                defaultChecked={row.isActive === 1}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleActiveChange(e, index)}
                              />
                            }
                            label={row.isActive === 1 ? 'Hiện' : 'Ẩn'}
                            onClick={(e: any) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            <Tooltip title="Sửa">
                              <Link to={`/quan-tri/san-pham/danh-muc/chinh-sua/${row.id}`}>
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
            Xác nhận xóa danh mục
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1
                ? selectedArr.length + ' danh mục này'
                : `danh mục "${rows[deleteRowIndex]?.name}"`}{' '}
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

export default CategoryProduct;
