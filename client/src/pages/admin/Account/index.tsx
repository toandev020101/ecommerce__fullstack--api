import { LoadingButton } from '@mui/lab';
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
import Papa from 'papaparse';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import {
  BiEdit as BiEditIcon,
  BiExport as BiExportIcon,
  BiImport as BiImportIcon,
  BiSearchAlt as BiSearchAltIcon,
  BiTrashAlt as BiTrashAltIcon,
} from 'react-icons/bi';
import {
  FiChevronDown as FiChevronDownIcon,
  FiChevronUp as FiChevronUpIcon,
  FiPlusSquare as FiPlusSquareIcon,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import * as roleApi from '../../../apis/roleApi';
import * as userApi from '../../../apis/userApi';
import { useAppDispatch } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import { HeadCell } from '../../../interfaces/HeadCell';
import { HeadFileCSV } from '../../../interfaces/HeadFileCSV';
import { UserInput } from '../../../interfaces/UserInput';
import { Role } from '../../../models/Role';
import { User } from '../../../models/User';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import JWTManager from '../../../utils/jwt';
import userSchema from '../../../validations/userSchema';

const Account: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const theme: Theme = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [roleId, setRoleId] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [isActive, setIsActive] = useState<string>('');

  const [rows, setRows] = useState<User[]>([]);
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

  const [isImportDataLoading, setIsImportDataLoading] = useState<boolean>(false);
  const [exportData, setExportData] = useState([]);
  const [isExportDataLoading, setIsExportDataLoading] = useState<boolean>(false);
  const csvDownloadRef: any = useRef(null);

  const headerData: HeadFileCSV[] = [
    {
      label: 'Họ và tên',
      key: 'fullName',
    },
    {
      label: 'Tên đăng nhập',
      key: 'username',
    },
    {
      label: 'Giới tính',
      key: 'gender',
    },
    {
      label: 'Email',
      key: 'email',
    },
    {
      label: 'Số điện thoại',
      key: 'phoneNumber',
    },
    {
      label: 'Vai trò',
      key: 'role',
    },
    {
      label: 'Ảnh đại diện',
      key: 'avatar',
    },
    {
      label: 'Trạng thái',
      key: 'isActive',
    },
    {
      label: 'Đường',
      key: 'street',
    },
    {
      label: 'Phường, xã',
      key: 'ward',
    },
    {
      label: 'Quận, huyện',
      key: 'district',
    },
    {
      label: 'Tỉnh, thành phố',
      key: 'province',
    },
    {
      label: 'Ngày tạo',
      key: 'createdAt',
    },
  ];

  const headCells: readonly HeadCell[] = [
    {
      label: 'Tài khoản',
      key: 'fullName',
      numeric: false,
      width: 300,
    },
    {
      label: 'Email',
      key: 'email',
      numeric: false,
      width: 300,
    },
    {
      label: 'Giới tính',
      key: 'gender',
      numeric: false,
      width: 150,
    },
    {
      label: 'Vai trò',
      key: 'role',
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

    if (queryParams.roleId) {
      setRoleId(queryParams.roleId as string);
    }

    if (queryParams.gender) {
      setGender(queryParams.gender as string);
    }

    if (queryParams.isActive) {
      setIsActive(queryParams.isActive as string);
    }

    if (queryParams.searchTerm) {
      setSearchTerm(queryParams.searchTerm as string);
    }
  }, [location]);

  useEffect(() => {
    const getAllRole = async () => {
      try {
        const res = await roleApi.getAll();
        setRoles(res.data as Role[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllRole();
  }, [navigate]);

  useEffect(() => {
    // bỏ chọn nếu lấy lại danh sách users
    setSelectedArr([]);

    // update url
    if (location.search) {
      const queryParams = queryString.parse(location.search);
      queryParams._page = page.toString();
      queryParams._limit = rowsPerPage.toString();
      queryParams._sort = sort;
      queryParams._order = order;
      queryParams.roleId = roleId;
      queryParams.gender = gender;
      queryParams.isActive = isActive;
      queryParams.searchTerm = searchTerm;

      const newUrl = location.pathname + '?' + queryString.stringify(queryParams);
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const getPaginationUser = async () => {
      setIsLoading(true);
      try {
        const res = await userApi.getPaginationAndRole({
          _limit: rowsPerPage,
          _page: page,
          _sort: sort,
          _order: order,
          roleId,
          gender,
          isActive,
          searchTerm,
        });

        const resData = res.data as User[];
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

    getPaginationUser();
  }, [
    dispatch,
    navigate,
    order,
    page,
    rowsPerPage,
    sort,
    reload,
    roleId,
    gender,
    isActive,
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
      const newSelectedArr = rows.filter((row) => row.id !== JWTManager.getUserId()).map((row) => row.id);
      setSelectedArr(newSelectedArr);
      return;
    }
    setSelectedArr([]);
  };

  const handleRowClick = (_event: React.MouseEvent<unknown>, id: number) => {
    if (id === JWTManager.getUserId()) return;

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
        res = await userApi.removeAny(selectedArr);
      } else {
        res = await userApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'account',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'accountId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'account',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'accountId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleRoleIdFilter = (e: SelectChangeEvent) => {
    setRoleId(e.target.value as string);
    setPage(0);
  };

  const handleGenderFilter = (e: SelectChangeEvent) => {
    setGender(e.target.value as string);
    setPage(0);
  };

  const handleIsActiveFilter = (e: SelectChangeEvent) => {
    setIsActive(e.target.value as string);
    setPage(0);
  };

  const handleResetFilterClick = () => {
    setRoleId('');
    setGender('');
    setIsActive('');
    setPage(0);
  };

  // Hàm này được gọi khi người dùng chọn file để nhập
  const handleImportDataUpload = (e: any) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: async (results: any) => {
        setIsImportDataLoading(true);

        // Xử lý dữ liệu ở đây
        const data: UserInput[] = [];
        for (let i = 1; i < results.data.length - 1; i++) {
          let user: any = {};
          for (let j = 0; j < results.data[i].length; j++) {
            if (results.data[0][j] && results.data[0][j] !== '') {
              user[results.data[0][j]] = results.data[i][j] !== '' ? results.data[i][j] : null;
            }
          }
          data.push(user);
        }

        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].username === data[j].username || (data[i].email && data[i].email === data[j].email)) {
              dispatch(
                showToast({
                  page: 'account',
                  type: 'error',
                  message: 'Nhập file .csv thất bại',
                  options: { theme: 'colored', toastId: 'accountId' },
                }),
              );
              setIsImportDataLoading(false);
              return;
            }
          }
        }

        try {
          await yup.array().of(userSchema).validate(data);
        } catch (error: any) {
          setIsImportDataLoading(false);
          dispatch(
            showToast({
              page: 'account',
              type: 'error',
              message: 'Nhập file .csv thất bại',
              options: { theme: 'colored', toastId: 'accountId' },
            }),
          );
          return;
        }

        try {
          await userApi.addAny(data);

          setReload(!reload);
          setIsImportDataLoading(false);
          dispatch(
            showToast({
              page: 'account',
              type: 'success',
              message: 'Nhập file .csv thành công',
              options: { theme: 'colored', toastId: 'accountId' },
            }),
          );
        } catch (error: any) {
          const { data } = error.response;
          setIsImportDataLoading(false);

          if (data.code === 400 || data.code === 403) {
            dispatch(
              showToast({
                page: 'account',
                type: 'error',
                message: data.code === 400 ? 'Nhập file .csv thất bại' : data.message,
                options: { theme: 'colored', toastId: 'accountId' },
              }),
            );
          } else if (data.code === 401 || data.code === 500) {
            navigate(`/error/${data.code}`);
          }
        }
      },
    });
  };

  const handleExportDataClick = async () => {
    setIsExportDataLoading(true);
    try {
      const res = await userApi.getAllAndRole();
      const users = res.data as User[];

      let data: any = [];
      for (let i = 0; i < users.length; i++) {
        data.push({
          fullName: users[i].fullName,
          username: users[i].username,
          gender: users[i].gender === 0 ? 'Nam' : 'Nữ',
          email: users[i].email,
          phonNumber: users[i].phoneNumber,
          role: users[i].role?.name,
          avatar: users[i].avatar,
          isActive: users[i].isActive === 0 ? 'Hoạt động' : 'Khóa',
          street: users[i].street,
          ward: users[i].ward ? users[i].ward?.name : '',
          district: users[i].district ? users[i].district?.name : '',
          province: users[i].province ? users[i].province?.name : '',
          createdAt: users[i].createdAt,
        });
      }

      setExportData(data);

      setTimeout(() => {
        csvDownloadRef.current.link.click();
      }, 500);

      setIsExportDataLoading(false);

      dispatch(
        showToast({
          page: 'account',
          type: 'success',
          message: 'Xuất file .csv thành công',
          options: { theme: 'colored', toastId: 'accountId' },
        }),
      );
    } catch (error: any) {
      const { data } = error.response;
      setIsExportDataLoading(false);
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'account',
            type: 'error',
            message: data.code === 403 ? data.message : 'Xuất file .csv thất bại',
            options: { theme: 'colored', toastId: 'accountId' },
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
      const res = await userApi.changeActive(id, { isActive: isActive ? 1 : 0 });
      dispatch(
        showToast({
          page: 'account',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'accountId' },
        }),
      );

      rows[index].isActive = isActive ? 1 : 0;
      setRows([...rows]);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'account',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'accountId' },
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
      <TitlePage title="Danh sách tài khoản" />
      <ToastNotify name="account" />

      {/* filter */}
      <Box
        padding="20px"
        marginBottom="20px"
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
        }}
      >
        <Typography variant="h4" marginBottom="20px">
          Bộ lọc tìm kiếm
        </Typography>
        <Box display="flex" gap="20px">
          {/* select */}
          <FormControl fullWidth>
            <InputLabel id="select-role" sx={{ fontSize: '15px' }}>
              Chọn vai trò
            </InputLabel>
            <Select
              labelId="select-role"
              id="select"
              value={roleId}
              label="Chọn vai trò"
              onChange={handleRoleIdFilter}
              sx={{ fontSize: '15px' }}
            >
              <MenuItem value="">Chọn vai trò</MenuItem>
              {roles.map((roleItem, index) => (
                <MenuItem key={`role-item-${index}`} value={roleItem.id}>
                  {roleItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* select */}

          {/* select */}
          <FormControl fullWidth>
            <InputLabel id="select-gender" sx={{ fontSize: '15px' }}>
              Chọn giới tính
            </InputLabel>
            <Select
              labelId="select-gender"
              id="select"
              value={gender}
              label="Chọn giới tính"
              onChange={handleGenderFilter}
              sx={{ fontSize: '15px' }}
            >
              <MenuItem value="">Chọn giới tính</MenuItem>
              <MenuItem value="0">Nam</MenuItem>
              <MenuItem value="1">Nữ</MenuItem>
            </Select>
          </FormControl>
          {/* select */}

          {/* select */}
          <FormControl fullWidth>
            <InputLabel id="select-active" sx={{ fontSize: '15px' }}>
              Chọn trạng thái
            </InputLabel>
            <Select
              labelId="select-active"
              id="select"
              value={isActive}
              label="Chọn trạng thái"
              onChange={handleIsActiveFilter}
              sx={{ fontSize: '15px' }}
            >
              <MenuItem value="">Chọn trạng thái</MenuItem>
              <MenuItem value="0">Khóa</MenuItem>
              <MenuItem value="1">Hoạt động</MenuItem>
            </Select>
          </FormControl>
          {/* select */}
        </Box>

        {(roleId !== '' || gender !== '' || isActive !== '') && (
          <Box textAlign="end" marginTop="20px">
            <Button variant="outlined" color="error" startIcon={<BiTrashAltIcon />} onClick={handleResetFilterClick}>
              Xóa bộ lọc
            </Button>
          </Box>
        )}
      </Box>
      {/* filter */}

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
            <LoadingButton
              variant="outlined"
              color="secondary"
              startIcon={<BiImportIcon />}
              component="label"
              loading={isImportDataLoading}
              loadingPosition="start"
            >
              Nhập File .CSV
              <input hidden accept=".csv" type="file" onChange={handleImportDataUpload} />
            </LoadingButton>

            <CSVLink
              data={exportData}
              headers={headerData}
              filename={'user_data.csv'}
              target="_blank"
              ref={csvDownloadRef}
              hidden
            />
            <LoadingButton
              variant="outlined"
              color="success"
              startIcon={<BiExportIcon />}
              disabled={rows.length === 0}
              loading={isExportDataLoading}
              loadingPosition="start"
              onClick={handleExportDataClick}
            >
              Xuất File .CSV
            </LoadingButton>

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

            <Link to="/quan-tri/tai-khoan/danh-sach/them-moi">
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
                    indeterminate={
                      selectedArr.length > (!!rows.find((row) => row.id === JWTManager.getUserId()) ? 1 : 0) &&
                      selectedArr.length <
                        (!!rows.find((row) => row.id === JWTManager.getUserId()) ? rows.length - 1 : rows.length)
                    }
                    checked={
                      rows.length > (!!rows.find((row) => row.id === JWTManager.getUserId()) ? 1 : 0) &&
                      selectedArr.length ===
                        (!!rows.find((row) => row.id === JWTManager.getUserId()) ? rows.length - 1 : rows.length)
                    }
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
                            <Skeleton animation="wave" variant="circular">
                              <Avatar sx={{ width: 34, height: 34 }} />
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
                          <Skeleton animation="wave" width="100%">
                            <Typography>email</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Giới tính</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Vai trò</Typography>
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
                          {row.id !== JWTManager.getUserId() && (
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
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" alignItems="center" gap="10px">
                            {row.avatar ? (
                              <Avatar src={row.avatar} sx={{ width: 36, height: 36 }} />
                            ) : (
                              <Avatar sx={{ width: 36, height: 36 }}>{row.fullName.charAt(0)}</Avatar>
                            )}
                            <Box>
                              <Typography variant="h6">{row.fullName}</Typography>
                              <Typography color={theme.palette.neutral[400]}>@{row.username}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.email ? row.email : '--'}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.gender ? 'Nữ' : 'Nam'}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.role?.name}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                defaultChecked={row.isActive === 1}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleActiveChange(e, index)}
                              />
                            }
                            label={row.isActive === 1 ? 'Hoạt động' : 'Khóa'}
                            onClick={(e: any) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            <Tooltip title="Sửa">
                              <Link to={`/quan-tri/tai-khoan/danh-sach/chinh-sua/${row.id}`}>
                                <IconButton>
                                  <BiEditIcon style={{ color: theme.palette.warning.main }} />
                                </IconButton>
                              </Link>
                            </Tooltip>

                            {row.id !== JWTManager.getUserId() && (
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
                            )}
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
            Xác nhận xóa tài khoản
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1
                ? selectedArr.length + ' tài khoản này'
                : `tài khoản "${rows[deleteRowIndex]?.fullName}"`}{' '}
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

export default Account;
