import { LoadingButton } from '@mui/lab';
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
  BiDetail as BiDetailIcon,
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
import { IoMdImages as IoMdImagesIcon } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import * as categoryApi from '../../../apis/categoryApi';
import * as productApi from '../../../apis/productApi';
import { useAppDispatch } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import { HeadCell } from '../../../interfaces/HeadCell';
import { HeadFileCSV } from '../../../interfaces/HeadFileCSV';
import { ProductInput } from '../../../interfaces/ProductInput';
import { Category } from '../../../models/Category';
import { Product, ProductItem } from '../../../models/Product';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import { priceFormat } from '../../../utils/format';
import productSchema from '../../../validations/productSchema';
import { toDate } from '../../../utils/date';

const ProductManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const theme: Theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [categoryId, setCategoryId] = useState<string>('');
  const [inventoryStatus, setInventoryStatus] = useState<string>('');
  const [isActive, setIsActive] = useState<string>('');

  const [rows, setRows] = useState<Product[]>([]);
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
      label: 'Tên sản phẩm',
      key: 'name',
    },
    {
      label: 'Đường dẫn',
      key: 'slug',
    },
    {
      label: 'Ảnh sản phẩm',
      key: 'imageUrl',
    },
    {
      label: 'Ảnh biến thể',
      key: 'itemImageUrl',
    },
    {
      label: 'SKU biến thể',
      key: 'itemSKU',
    },
    {
      label: 'Giá biến thể',
      key: 'itemPrice',
    },
    {
      label: 'Giá ưu đãi biến thể',
      key: 'itemDiscount',
    },
    {
      label: 'Ngày bắt đầu ưu đãi biến thể',
      key: 'itemDiscountStartDate',
    },
    {
      label: 'Ngày kết thúc ưu đãi biến thể',
      key: 'itemDiscountEndDate',
    },
    {
      label: 'Thư viện ảnh biến thể',
      key: 'itemLibrary',
    },
    {
      label: 'Số lượng biến thể',
      key: 'itemInventoryQuantity',
    },
    {
      label: 'Giá nhập biến thể',
      key: 'itemInventoryPriceEntry',
    },
    {
      label: 'Mã vị trí biến thể',
      key: 'itemInventoryLocationCode',
    },
    {
      label: 'Trọng lượng (KG)',
      key: 'weight',
    },
    {
      label: 'Chiều dài (CM)',
      key: 'length',
    },
    {
      label: 'Chiều rộng (CM)',
      key: 'width',
    },
    {
      label: 'Chiều cao (CM)',
      key: 'height',
    },
    {
      label: 'Danh mục',
      key: 'category',
    },
    {
      label: 'Từ khóa',
      key: 'tags',
    },
    {
      label: 'Sản phẩm liên quan',
      key: 'connects',
    },
    {
      label: 'Nổi bật',
      key: 'isHot',
    },
    {
      label: 'Trạng thái',
      key: 'isActive',
    },
    {
      label: 'Ngày tạo',
      key: 'createdAt',
    },
    {
      label: 'Ngày cập nhật',
      key: 'updatedAt',
    },
  ];

  const headCells: readonly HeadCell[] = [
    {
      label: 'Sản phẩm',
      key: 'name',
      numeric: false,
      width: 300,
    },
    {
      label: 'Kho',
      numeric: false,
      width: 100,
    },
    {
      label: 'Giá',
      key: 'price',
      numeric: false,
      width: 100,
    },
    {
      label: 'Danh mục',
      numeric: false,
      width: 150,
    },
    {
      label: 'Từ khóa',
      numeric: false,
      width: 200,
    },
    {
      label: 'Nổi bật',
      key: 'isHot',
      numeric: false,
      width: 120,
    },
    {
      label: 'Trạng thái',
      key: 'isActive',
      numeric: false,
      width: 150,
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

    if (queryParams.categoryId) {
      setCategoryId(queryParams.categoryId as string);
    }

    if (queryParams.inventoryStatus) {
      setInventoryStatus(queryParams.inventoryStatus as string);
    }

    if (queryParams.isActive) {
      setIsActive(queryParams.isActive as string);
    }

    if (queryParams.searchTerm) {
      setSearchTerm(queryParams.searchTerm as string);
    }
  }, [location]);

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data as Category[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllCategory();
  }, [navigate]);

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
      queryParams.categoryId = categoryId;
      queryParams.inventoryStatus = inventoryStatus;
      queryParams.isActive = isActive;
      queryParams.searchTerm = searchTerm;

      const newUrl = location.pathname + '?' + queryString.stringify(queryParams);
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const getPaginationProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          _sort: sort,
          _order: order,
          categoryId,
          inventoryStatus,
          isActive,
          searchTerm,
        });

        const resData = res.data as Product[];
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

    getPaginationProduct();
  }, [
    dispatch,
    navigate,
    order,
    page,
    rowsPerPage,
    sort,
    reload,
    categoryId,
    inventoryStatus,
    isActive,
    searchTerm,
    location.search,
    location.pathname,
  ]);

  const handleInventoryStatus = (items: ProductItem[]) => {
    let quantityTotal = 0;
    items.forEach((item) => {
      quantityTotal += item.inventory.quantity;
    });

    return quantityTotal > 0;
  };

  const handlePrice = (items: ProductItem[]) => {
    const currentDate = new Date();
    const priceArr = items.map((item) => {
      if (toDate(item.discountStartDate) <= currentDate && toDate(item.discountEndDate) >= currentDate) {
        return item.discount;
      }

      return item.price;
    });

    // min -> max
    priceArr.sort((price1, price2) => price1 - price2);

    return priceArr.length > 1 && priceArr[0] !== priceArr[priceArr.length - 1]
      ? `${priceFormat(priceArr[0])} - ${priceFormat(priceArr[priceArr.length - 1])}`
      : priceFormat(priceArr[0]);
  };

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
        res = await productApi.removeAny(selectedArr);
      } else {
        res = await productApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'product',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'productId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'product',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'productId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleCategoryIdFilter = (e: SelectChangeEvent) => {
    setCategoryId(e.target.value as string);
    setPage(0);
  };

  const handleInventoryStatusFilter = (e: SelectChangeEvent) => {
    setInventoryStatus(e.target.value as string);
    setPage(0);
  };

  const handleIsActiveFilter = (e: SelectChangeEvent) => {
    setIsActive(e.target.value as string);
    setPage(0);
  };

  const handleResetFilterClick = () => {
    setCategoryId('');
    setInventoryStatus('');
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
        const fileData: any[] = [];
        for (let i = 1; i < results.data.length - 1; i++) {
          let product: any = {};
          for (let j = 0; j < results.data[i].length; j++) {
            if (results.data[0][j] && results.data[0][j] !== '') {
              product[results.data[0][j]] = results.data[i][j] !== '' ? results.data[i][j] : null;
            }
          }
          fileData.push(product);
        }

        const data: ProductInput[] = [];
        for (let i = 0; i < fileData.length; i++) {
          data.push({
            imageUrl: fileData[i].imageUrl as string,
            name: fileData[i].name as string,
            slug: fileData[i].slug as string,
            weight: fileData[i].weight as number,
            length: fileData[i].length as number,
            width: fileData[i].width as number,
            height: fileData[i].height as number,
            categoryId: fileData[i].categoryId as number,
            isHot: fileData[i].isHot as number,
            isActive: fileData[i].isActive as number,
            shortDescription: '',
            description: '',

            items: [
              {
                idx: fileData[i].itemIdx as string,
                SKU: fileData[i].itemSKU as string,
                price: fileData[i].itemPrice as number,
                discount: fileData[i].itemDiscount as number,
                discountStartDate: fileData[i].itemDiscountStartDate as string,
                discountEndDate: fileData[i].itemDiscountEndDate as string,
                imageUrl: fileData[i].itemImageUrl as string,
                library: fileData[i].itemLibrary ? (fileData[i].itemLibrary.split(',') as string[]) : [],
                inventory: {
                  quantity: fileData[i].itemInventoryQuantity as number,
                  priceEntry: fileData[i].itemInventoryPriceEntry as number,
                  locationCode: fileData[i].itemInventoryLocationCode as string,
                },
              },
            ],

            connectIds: fileData[i].connects ? (fileData[i].connects.split(',') as number[]) : [],

            tagIds: fileData[i].tags ? (fileData[i].tags.split(',') as number[]) : [],
          });
        }

        // merge items duplicated product
        const indexRemove = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].slug === data[j].slug) {
              data[i].items = [...data[i].items, ...data[j].items];
              indexRemove.push(j);
              i = j;
            }
          }
        }

        // remove product
        for (let i = 0; i < indexRemove.length; i++) {
          data.splice(indexRemove[i], 1);
        }

        try {
          await yup.array().of(productSchema).validate(data);
        } catch (error: any) {
          setIsImportDataLoading(false);
          dispatch(
            showToast({
              page: 'product',
              type: 'error',
              message: 'Nhập file .csv thất bại',
              options: { theme: 'colored', toastId: 'productId' },
            }),
          );
          return;
        }

        try {
          await productApi.addAny(data);

          setReload(!reload);
          setIsImportDataLoading(false);
          dispatch(
            showToast({
              page: 'product',
              type: 'success',
              message: 'Nhập file .csv thành công',
              options: { theme: 'colored', toastId: 'productId' },
            }),
          );
        } catch (error: any) {
          const { data } = error.response;
          setIsImportDataLoading(false);

          if (data.code === 400 || data.code === 403) {
            dispatch(
              showToast({
                page: 'product',
                type: 'error',
                message: data.code === 400 ? 'Nhập file .csv thất bại' : data.message,
                options: { theme: 'colored', toastId: 'productId' },
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
      const res = await productApi.getAll();
      const products = res.data as Product[];

      let data: any = [];
      for (let i = 0; i < products.length; i++) {
        const productVariation = {
          name: products[i].name,
          slug: products[i].slug,
          imageUrl: products[i].imageUrl,
          weight: products[i].weight,
          length: products[i].length,
          width: products[i].width,
          height: products[i].height,
          category: products[i].category.name,
          isHot: products[i].isHot === 1 ? 'Có' : 'Không',
          isActive: products[i].isActive === 1 ? 'Hiện' : 'Ẩn',
          createdAt: products[i].createdAt,
          updatedAt: products[i].updatedAt,
        };

        // handle tags
        const tags = products[i].productTags?.map((productTag) => productTag.tag.name);

        // handle connect
        const connects = products[i].productConnects?.map((productConnect) => productConnect.connect.name);

        products[i].productItems.forEach((productItem) => {
          // handle library
          const itemLibrary = productItem.productImages?.map((productImage) => productImage.imageUrl);

          data.push({
            ...productVariation,
            itemImageUrl: productItem.imageUrl,
            itemSKU: productItem.SKU,
            itemPrice: productItem.price,
            itemDiscount: productItem.discount,
            itemDiscountStartDate: productItem.discountStartDate,
            itemDiscountEndDate: productItem.discountEndDate,
            itemLibrary,
            itemInventoryQuantity: productItem.inventory.quantity,
            itemInventoryPriceEntry: productItem.inventory.priceEntry,
            itemInventoryLocationCode: productItem.inventory.locationCode,
            tags,
            connects,
          });
        });
      }

      setExportData(data);

      setTimeout(() => {
        csvDownloadRef.current.link.click();
      }, 500);

      setIsExportDataLoading(false);

      dispatch(
        showToast({
          page: 'product',
          type: 'success',
          message: 'Xuất file .csv thành công',
          options: { theme: 'colored', toastId: 'productId' },
        }),
      );
    } catch (error: any) {
      const { data } = error.response;
      setIsExportDataLoading(false);
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'product',
            type: 'error',
            message: data.code === 403 ? data.message : 'Xuất file .csv thất bại',
            options: { theme: 'colored', toastId: 'productId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleHotChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const id = rows[index].id;
    const isHot = e.target.checked;

    try {
      const res = await productApi.changeHot(id, { isHot: isHot ? 1 : 0 });
      dispatch(
        showToast({
          page: 'product',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'productId' },
        }),
      );

      rows[index].isHot = isHot ? 1 : 0;
      setRows([...rows]);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'product',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'productId' },
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
      const res = await productApi.changeActive(id, { isActive: isActive ? 1 : 0 });
      dispatch(
        showToast({
          page: 'product',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'productId' },
        }),
      );

      rows[index].isActive = isActive ? 1 : 0;
      setRows([...rows]);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'product',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'productId' },
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
      <TitlePage title="Danh sách sản phẩm" />
      <ToastNotify name="product" />

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
            <InputLabel id="select-category" sx={{ fontSize: '15px' }}>
              Chọn danh mục
            </InputLabel>
            <Select
              labelId="select-category"
              id="select"
              value={categoryId}
              label="Chọn danh mục"
              onChange={handleCategoryIdFilter}
              sx={{ fontSize: '15px' }}
            >
              <MenuItem value="">Chọn danh mục</MenuItem>
              {categories.map((categoryItem, index) => (
                <MenuItem key={`category-item-${index}`} value={categoryItem.id}>
                  {categoryItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* select */}

          {/* select */}
          <FormControl fullWidth>
            <InputLabel id="select-inventoryStatus" sx={{ fontSize: '15px' }}>
              Chọn trạng thái kho
            </InputLabel>
            <Select
              labelId="select-inventoryStatus"
              id="select"
              value={inventoryStatus}
              label="Chọn trạng thái kho"
              onChange={handleInventoryStatusFilter}
              sx={{ fontSize: '15px' }}
            >
              <MenuItem value="">Chọn trạng thái kho</MenuItem>
              <MenuItem value="0">Hết hàng</MenuItem>
              <MenuItem value="1">Còn hàng</MenuItem>
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
              <MenuItem value="0">Ẩn</MenuItem>
              <MenuItem value="1">Hiện</MenuItem>
            </Select>
          </FormControl>
          {/* select */}
        </Box>

        {(categoryId !== '' || inventoryStatus !== '' || isActive !== '') && (
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
              filename={'product_data.csv'}
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
              label="Tìm kiếm sản phẩm"
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

            <Link to="/quan-tri/san-pham/danh-sach/them-moi">
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
                          <Box display="flex" alignItems="center" gap="10px">
                            <Skeleton animation="wave">
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
                            </Skeleton>

                            <Skeleton animation="wave" width="100%">
                              <Typography>Tên sản phẩm</Typography>
                            </Skeleton>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Kho</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Giá</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Danh mục</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Từ khóa</Typography>
                          </Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <FormControlLabel control={<Switch />} label={'Trạng thái'} />
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
                        <TableCell sx={{ fontSize: '14px' }}>
                          {handleInventoryStatus(row.productItems) ? (
                            <Box color={theme.palette.success.main} fontWeight={600}>
                              Còn hàng
                            </Box>
                          ) : (
                            <Box color={theme.palette.error.main} fontWeight={600}>
                              Hết hàng
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{handlePrice(row.productItems)}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{row.category.name}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          {row.productTags && row.productTags.length > 0
                            ? row.productTags.map((productTag, index) =>
                                index !== (row.productTags?.length as number) - 1
                                  ? productTag.tag.name + ', '
                                  : productTag.tag.name,
                              )
                            : '--'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                defaultChecked={row.isHot === 1}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHotChange(e, index)}
                              />
                            }
                            label=""
                            onClick={(e: any) => e.stopPropagation()}
                          />
                        </TableCell>
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
                            <Tooltip title="Xem chi tiết">
                              <Link to={`/${row.category.slug}/${row.slug}`} target="_blank">
                                <IconButton
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <BiDetailIcon style={{ color: theme.palette.info.main }} />
                                </IconButton>
                              </Link>
                            </Tooltip>

                            <Tooltip title="Sửa">
                              <Link to={`/quan-tri/san-pham/danh-sach/chinh-sua/${row.id}`}>
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
            Xác nhận xóa sản phẩm
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1
                ? selectedArr.length + ' sản phẩm này'
                : `sản phẩm "${rows[deleteRowIndex]?.name}"`}{' '}
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

export default ProductManager;
