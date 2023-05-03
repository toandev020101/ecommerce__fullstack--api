import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineMinus as AiOutlineMinusIcon, AiOutlinePlus as AiOutlinePlusIcon } from 'react-icons/ai';
import {
  BiDetail as BiDetailIcon,
  BiEdit as BiEditIcon,
  BiReset as BiResetIcon,
  BiTrashAlt as BiTrashAltIcon,
  BiX as BiXIcon,
} from 'react-icons/bi';
import { BsFillCaretDownFill as BsFillCaretDownFillIcon } from 'react-icons/bs';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { RiCoupon3Line as RiCoupon3LineIcon } from 'react-icons/ri';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as cartItemApi from '../../../apis/cartItemApi';
import * as couponApi from '../../../apis/couponApi';
import * as districtApi from '../../../apis/districtApi';
import * as orderApi from '../../../apis/orderApi';
import * as orderStatusApi from '../../../apis/orderStatusApi';
import * as paymentMethodApi from '../../../apis/paymentMethodApi';
import * as productApi from '../../../apis/productApi';
import * as provinceApi from '../../../apis/provinceApi';
import * as shipMethodApi from '../../../apis/shipMethodApi';
import * as wardApi from '../../../apis/wardApi';
import { useAppDispatch } from '../../../app/hook';
import InputField from '../../../components/InputField';
import SearchField from '../../../components/SearchField';
import SearchMultipleField from '../../../components/SearchMultipleField';
import SelectField from '../../../components/SelectField';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import { CartItemInput } from '../../../interfaces/CartItemInput';
import { FieldError } from '../../../interfaces/FieldError';
import { HeadCell } from '../../../interfaces/HeadCell';
import { OrderInput } from '../../../interfaces/OrderInput';
import { ValueObject } from '../../../interfaces/ValueObject';
import { CartItem } from '../../../models/CartItem';
import { Coupon } from '../../../models/Coupon';
import { District } from '../../../models/District';
import { Order } from '../../../models/Order';
import { OrderStatus } from '../../../models/OrderStatus';
import { PaymentMethod } from '../../../models/PaymentMethod';
import { Product } from '../../../models/Product';
import { Province } from '../../../models/Province';
import { ShipMethod } from '../../../models/ShipMethod';
import { Ward } from '../../../models/Ward';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import { toDate } from '../../../utils/date';
import { priceFormat } from '../../../utils/format';
import orderSchema from '../../../validations/orderSchema';
import JWTManager from '../../../utils/jwt';

const AddOrEditOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const { id } = useParams();
  const [mounted, setMounted] = useState<boolean>(false);

  const [statusOptions, setStatusOptions] = useState<ValueObject[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<ValueObject[]>([]);
  const [districtOptions, setDistrictOptions] = useState<ValueObject[]>([]);
  const [wardOptions, setWardOptions] = useState<ValueObject[]>([]);

  const [provinceSearchValue, setProvinceSearchValue] = useState<ValueObject>();
  const [districtSearchValue, setDistrictSearchValue] = useState<ValueObject>();
  const [wardSearchValue, setWardSearchValue] = useState<ValueObject>();

  const [provinceSearchTerm, setProvinceSearchTerm] = useState<string>('');
  const [districtSearchTerm, setDistrictSearchTerm] = useState<string>('');
  const [wardSearchTerm, setWardSearchTerm] = useState<string>('');

  const [provinceId, setProvinceId] = useState<number>(-1);
  const [districtId, setDistrictId] = useState<number>(-1);

  const [rows, setRows] = useState<CartItem[]>([]);
  const [selectedArr, setSelectedArr] = useState<number[]>([]);

  const [variations, setVariations] = useState<{ id: number; options: { name: string; slug: string }[] }[]>([]);
  const [menuRow, setMenuRow] = useState<CartItem>();
  const [menuItemId, setMenuItemId] = useState<number>();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number>(-1);
  const [reload, setReload] = useState<boolean>(false);

  const [openAddProductDialog, setOpenAddProductDialog] = useState<boolean>(false);
  const [productOptions, setProductOptions] = useState<ValueObject[]>([]);

  const [shipMethods, setShipMethods] = useState<ShipMethod[]>([]);
  const [shipMethodValue, setShipMethodValue] = useState<number>();
  const [openUpdateShipMethodDialog, setOpenUpdateShipMethodDialog] = useState<boolean>(false);
  const [shipMethodActive, setShipMethodActive] = useState<ShipMethod>();

  const [coupons, setCoupons] = useState<{ code: string; price: number }[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodActive, setPaymentMethodActive] = useState<PaymentMethod>();
  const [voucherValue, setVoucherValue] = useState<string>();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shipPrice, setShipPrice] = useState<number>(0);
  const [totalVoucherPrice, setTotalVoucherPrice] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const [anchorElVariationMenu, setAnchorElVariationMenu] = useState<null | HTMLElement>(null);
  const openVariationMenu = Boolean(anchorElVariationMenu);
  const handleVariationMenuClick = (event: any, row: CartItem) => {
    event.stopPropagation();
    setAnchorElVariationMenu(event.currentTarget);
    setMenuRow(row);
    setMenuItemId(row.productItemId);

    // handle variation
    const newVariations: { id: number; options: { name: string; slug: string }[] }[] = [];

    row.productItem.product.productItems.forEach((productItem: any) => {
      productItem.productConfigurations.forEach((productConfiguration: any) => {
        const variationIndex = newVariations.findIndex(
          (variation) => variation.id === productConfiguration.variationOption.variationId,
        );

        if (variationIndex === -1) {
          newVariations.push({
            id: productConfiguration.variationOption.variationId,
            options: [
              {
                name: productConfiguration.variationOption.value,
                slug: productConfiguration.variationOption.slug,
              },
            ],
          });
        } else {
          const variationOptionIndex = newVariations[variationIndex].options.findIndex(
            (option) => option.slug === productConfiguration.variationOption.slug,
          );

          if (variationOptionIndex === -1) {
            newVariations[variationIndex].options.push({
              name: productConfiguration.variationOption.value,
              slug: productConfiguration.variationOption.slug,
            });
          }
        }
      });
    });

    setVariations(newVariations);
  };
  const handleVariationMenuClose = (event: any) => {
    event.stopPropagation();
    setAnchorElVariationMenu(null);
  };

  const headCells: readonly HeadCell[] = [
    {
      label: 'Sản phẩm',
      numeric: false,
    },
    {
      label: 'Đơn giá',
      numeric: false,
    },
    {
      label: 'Số lượng',
      numeric: false,
    },
    {
      label: 'Thành tiền',
      numeric: false,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  const form = useForm<OrderInput>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      totalQuantity: 0,
      totalPrice: 0,
      street: '',
      wardId: '',
      districtId: '',
      provinceId: '',
      note: '',
      shipMethodId: 0,
      paymentMethodId: 0,
      orderStatusId: 1,
      lines: [],
      coupons: [],
      productOptions: [],
    },
    resolver: yupResolver(orderSchema),
  });

  useEffect(() => {
    const getListProvinceBySearchTerm = async () => {
      try {
        const res = await provinceApi.getListBySearchTerm(provinceSearchTerm);
        const resData = res.data as Province[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setProvinceOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListProvinceBySearchTerm();
  }, [provinceSearchTerm, navigate]);

  useEffect(() => {
    const getListDistrictByProvinceIdAndSearchTerm = async () => {
      try {
        const res = await districtApi.getListByProvinceIdAndSearchTerm(provinceId, districtSearchTerm);
        const resData = res.data as District[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setDistrictOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getListDistrictByProvinceIdAndSearchTerm();
  }, [districtSearchTerm, navigate, provinceId]);

  useEffect(() => {
    const getListWardByDistrictIdAndSearchTerm = async () => {
      try {
        const res = await wardApi.getListByDistrictIdAndSearchTerm(districtId, wardSearchTerm);
        const resData = res.data as Ward[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setWardOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getListWardByDistrictIdAndSearchTerm();
  }, [wardSearchTerm, navigate, districtId]);

  useEffect(() => {
    const getAllCartItem = async () => {
      try {
        const res = await cartItemApi.getAll();
        const resData = res.data as CartItem[];
        setRows(resData);

        handleUpdateTotalPrice(resData);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllCartItem();
  }, [dispatch, navigate, reload]);

  useEffect(() => {
    const getAllShipMethod = async () => {
      try {
        const res = await shipMethodApi.getAll();
        const resData = res.data as ShipMethod[];

        setShipMethods(resData);
        setShipMethodActive(resData[0]);
        setShipMethodValue(resData[0].id);
        setShipPrice(resData[0].price);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllShipMethod();
  }, [navigate]);

  useEffect(() => {
    const getAllPaymentMethod = async () => {
      try {
        const res = await paymentMethodApi.getAll();
        const resData = res.data as PaymentMethod[];

        setPaymentMethods(resData);
        setPaymentMethodActive(resData[0]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllPaymentMethod();
  }, [navigate]);

  useEffect(() => {
    const getAllOrderStatus = async () => {
      try {
        const res = await orderStatusApi.getAll();
        const resData = res.data as OrderStatus[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          if (resData[i].isShip !== 1) {
            data.push({ label: resData[i].name, value: resData[i].id });
          }
        }

        setStatusOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllOrderStatus();
  }, [navigate]);

  useEffect(() => {
    // check mode add or edit
    const { pathname } = location;
    const slugArr = pathname.split('/');
    const mode = slugArr[slugArr.length - 2];

    const getOneOrder = async () => {
      try {
        const res = await orderApi.getOneById(parseInt(id as string));
        const resData = res.data as Order;

        setProvinceId(resData.provinceId ? resData.provinceId : -1);
        setDistrictId(resData.districtId ? resData.districtId : -1);

        setProvinceSearchValue({ label: resData.province?.name as string, value: resData.provinceId as number });
        setDistrictSearchValue({ label: resData.district?.name as string, value: resData.districtId as number });
        setWardSearchValue({ label: resData.ward?.name as string, value: resData.wardId as number });

        const newCoupons = resData.orderCoupons.map((coupon) => ({ code: coupon.code, price: coupon.price }));
        setCoupons(newCoupons);

        let newTotalVoucherPrice = 0;
        newCoupons.forEach((coupon) => {
          newTotalVoucherPrice += coupon.price;
        });
        setTotalVoucherPrice(newTotalVoucherPrice);

        const newRows = resData.orderLines.map((row) => ({
          quantity: row.quantity,
          productItemId: row.productItemId,
        }));
        if (mounted) {
          const cartItemRes = await cartItemApi.getAll();
          const cartItemResData = cartItemRes.data as CartItem[];
          let checkCartItem = true;

          for (let i = 0; i < cartItemResData.length; i++) {
            for (let j = 0; j < rows.length; j++) {
              if (
                cartItemResData[i].productItemId === rows[j].productItemId &&
                cartItemResData[i].userId === JWTManager.getUserId()
              ) {
                checkCartItem = false;
                break;
              }
            }

            if (!checkCartItem) {
              break;
            }
          }

          if (checkCartItem) {
            await cartItemApi.addAny(newRows);
            setReload(!reload);
          }
        } else {
          setMounted(true);
        }

        const newShipMethodActive = shipMethods.find((shipMethod) => shipMethod.id === resData.shipMethodId);
        if (newShipMethodActive) {
          setShipMethodActive(newShipMethodActive);
          setShipMethodValue(newShipMethodActive.id);
        }

        const newPaymentMethodActive = paymentMethods.find(
          (paymentMethod) => paymentMethod.id === resData.paymentMethodId,
        );
        if (newPaymentMethodActive) {
          setPaymentMethodActive(newPaymentMethodActive);
        }

        form.reset({
          fullName: resData.fullName,
          phoneNumber: resData.phoneNumber,
          totalQuantity: resData.totalQuantity,
          totalPrice: resData.totalPrice,
          street: resData.street,
          wardId: resData.wardId,
          districtId: resData.districtId,
          provinceId: resData.provinceId,
          note: resData.note ? resData.note : '',
          shipMethodId: resData.shipMethodId,
          paymentMethodId: resData.paymentMethodId,
          lines: [],
          coupons: newCoupons,
          orderStatusId: resData.orderStatusId,
        });
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 404 || data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (mode === 'chinh-sua') {
      getOneOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, location, navigate, mounted]);

  const handleSearchTermProductChange = async (searchTerm: string) => {
    try {
      const res = await productApi.getListBySearchTerm(searchTerm);
      const resData = res.data as Product[];
      let data: ValueObject[] = [];

      for (let i = 0; i < resData.length; i++) {
        data.push({ label: resData[i].name, value: resData[i].id });
      }
      setProductOptions(data);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleAddProductDialogClose = () => {
    setOpenAddProductDialog(false);
  };

  const handleUpdateShipMethodDialogClose = () => {
    setOpenUpdateShipMethodDialog(false);
  };

  const handleAddProductClick = async () => {
    const productOptions = form.getValues('productOptions') as ValueObject[];

    if (productOptions.length > 0) {
      const productIds: number[] = productOptions.map((productOption) => productOption.value as number);

      try {
        let resProduct = await productApi.getListByIds(productIds);
        let resData = resProduct.data as Product[];

        let values: CartItemInput[] | any[] = resData.map((product) => {
          let productItemId = 0;
          const productItems = product.productItems;
          for (let i = 0; i < productItems.length; i++) {
            if (productItems[i].inventory.quantity > 0) {
              productItemId = productItems[i].id;
              return {
                quantity: 1,
                productItemId,
              };
            }
          }
          return null;
        });

        values = values.filter((value) => value !== null);

        const res = await cartItemApi.addAny(values);
        setReload(!reload);

        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'success',
            message: res.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 400 || data.code === 403 || data.code === 404) {
          setErrors(data.errors);
          dispatch(
            showToast({
              page: 'addOrEditOrder',
              type: 'error',
              message: data.message,
              options: { theme: 'colored', toastId: 'addOrEditOrderId' },
            }),
          );
        } else if (data.code === 401 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    }
  };

  const handleUpdateTotalPrice = (rows: CartItem[]) => {
    let newTotalPrice = 0;
    rows.forEach((row) => {
      newTotalPrice += row.productItem.price * row.quantity;
    });

    setTotalPrice(newTotalPrice);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedArr = rows.map((row) => row.id);
      setSelectedArr(newSelectedArr);

      handleUpdateTotalPrice(rows);
      return;
    }

    setSelectedArr([]);
    setTotalPrice(0);
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

    let newTotalPrice = totalPrice;
    const rowIndex = rows.findIndex((row) => row.id === id);
    const rowTotalPrice = handleDiscount(rows[rowIndex])
      ? rows[rowIndex].quantity * rows[rowIndex].productItem.discount
      : rows[rowIndex].quantity * rows[rowIndex].productItem.price;

    if (selectedIndex === -1) {
      newTotalPrice += rowTotalPrice;
    } else {
      newTotalPrice -= rowTotalPrice;
    }
    setTotalPrice(newTotalPrice);
  };

  const isSelected = (id: number) => selectedArr.indexOf(id) !== -1;

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
        res = await cartItemApi.removeAny(selectedArr);
      } else {
        res = await cartItemApi.removeOne(rows[deleteRowIndex].id);
      }

      dispatch(
        showToast({
          page: 'addOrEditOrder',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'addOrEditOrderId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
      setDeleteRowIndex(-1);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleVariationOptionClick = (variationId: number, optionActiveArr: string[], optionSlug: string) => {
    optionActiveArr.forEach((optionActive, index) => {
      const variationIndex = variations.findIndex((variation) => variation.id === variationId);

      const variationOptionIndex = variations[variationIndex].options.findIndex(
        (option) => option.slug === optionActive,
      );

      if (variationOptionIndex !== -1) {
        optionActiveArr[index] = optionSlug;
        return;
      }
    });

    const SKUActive = optionActiveArr.join('_');

    menuRow?.productItem.product.productItems.forEach((productItem: any) => {
      if (productItem.SKU === SKUActive) {
        setMenuItemId(productItem.id);
      }
    });
  };

  const handleVariationClick = async (id: number) => {
    // update client
    const newRows = [...rows];
    const newRowIndex = newRows.findIndex((row) => row.id === id);

    // check cart unique
    const cartItemIndex = rows.findIndex((row) => row.productItemId === menuItemId);
    if (cartItemIndex !== -1) {
      newRows[newRowIndex].quantity += rows[cartItemIndex].quantity;
      newRows.splice(cartItemIndex, 1);
    }

    const newProductItem: any = menuRow?.productItem.product.productItems.find(
      (productItem) => productItem.id === menuItemId,
    );
    newRows[newRowIndex].productItemId = newProductItem.id;
    newRows[newRowIndex].productItem = { ...newProductItem, product: newRows[newRowIndex].productItem.product };

    setRows(newRows);
    handleUpdateTotalPrice(newRows);

    // update server
    try {
      const res = await cartItemApi.changeProductItem(id, { productItemId: menuItemId as number });
      dispatch(
        showToast({
          page: 'addOrEditOrder',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'addOrEditOrderId' },
        }),
      );
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleQuantityClick = async (index: number, quantity: number) => {
    // update client
    const newRows = [...rows];
    newRows[index].quantity = quantity;
    setRows(newRows);
    handleUpdateTotalPrice(newRows);

    // update server
    try {
      const res = await cartItemApi.changeQuantity(newRows[index].id, { quantity });
      dispatch(
        showToast({
          page: 'addOrEditOrder',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'addOrEditOrderId' },
        }),
      );
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleDiscount = (row: CartItem) => {
    const currentDate = new Date();
    const productItem = row.productItem;
    if (
      productItem &&
      toDate(productItem.discountStartDate) <= currentDate &&
      toDate(productItem.discountEndDate) >= currentDate
    ) {
      return true;
    }
    return false;
  };

  const handleVoucherClick = async () => {
    try {
      const res = await couponApi.checkOne(voucherValue as string);
      const resData = res.data as Coupon;

      const newCoupons = [...coupons];
      const newCouponIndex = newCoupons.findIndex((newCoupon) => newCoupon.code === resData.code);
      if (newCouponIndex === -1) {
        let newCoupon = { code: resData.code, price: 0 };
        let newTotalVoucherPrice = totalVoucherPrice;
        if (resData.type === 1) {
          if (resData.priceMax && (totalPrice * resData.discountValue) / 100 > resData.priceMax) {
            newCoupon.price = resData.priceMax;
          } else {
            newCoupon.price = (totalPrice * resData.discountValue) / 100;
          }
        } else {
          newCoupon.price = resData.discountValue;
        }

        newCoupons.push(newCoupon);
        setCoupons(newCoupons);

        newTotalVoucherPrice += newCoupon.price;
        setTotalVoucherPrice(newTotalVoucherPrice);

        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'success',
            message: res.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      } else {
        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'warning',
            message: 'Mã giảm giá đã được áp dụng',
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      }
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 403 || data.code === 404) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleVoucherDelete = (index: number) => {
    const newCoupons = [...coupons];

    const newTotalVoucherPrice = totalVoucherPrice - newCoupons[index].price;
    setTotalVoucherPrice(newTotalVoucherPrice);

    newCoupons.splice(index, 1);
    setCoupons(newCoupons);
  };

  const handleAddOrEditSubmit = async (values: any) => {
    setIsLoading(true);

    delete values['productOptions'];

    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = null;
      }
    }

    let totalQuantity = 0;
    rows.forEach((row) => {
      totalQuantity += row.quantity;
    });

    values.totalQuantity = totalQuantity;
    values.totalPrice = totalPrice + shipPrice - totalVoucherPrice;
    values.shipMethodId = shipMethodActive?.id as number;
    values.paymentMethodId = paymentMethodActive?.id as number;
    values.lines = rows.map((row) => {
      // handle variation active
      let variationActive = '';
      if (row.productItem.productConfigurations) {
        row.productItem.productConfigurations.forEach((productConfiguration, index) => {
          variationActive += productConfiguration.variationOption.value;
          if (index !== (row.productItem.productConfigurations?.length as number) - 1) {
            variationActive += ', ';
          }
        });
      }

      return {
        variation: variationActive,
        quantity: row.quantity,
        price: handleDiscount(row) ? row.productItem.discount : row.productItem.price,
        productItemId: row.productItemId,
      };
    });
    values.coupons = coupons;

    try {
      let res: BaseResponse;
      if (id) {
        res = await orderApi.updateOne(parseInt(id), values);
      } else {
        res = await orderApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'order',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'orderId' },
        }),
      );
      setIsLoading(false);
      navigate('/quan-tri/don-hang/danh-sach');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditOrder',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditOrderId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleCancelForm = async () => {
    if (rows.length > 0) {
      const confirmed = window.confirm('Bạn vẫn chưa lưu dữ liệu, bạn có chắc chắn muốn rời khỏi trang?');
      if (confirmed) {
        // Thực hiện hành động khi người dùng rời khỏi trang
        const cartItemIds = rows.map((row) => row.id);
        await cartItemApi.removeAny(cartItemIds);

        navigate('/quan-tri/don-hang/danh-sach');
      }
    } else {
      navigate('/quan-tri/don-hang/danh-sach');
    }
  };

  return (
    <>
      <TitlePage title={`${id ? 'Chỉnh sửa' : 'Thêm mới'} đơn hàng`} />
      <ToastNotify name="addOrEditOrder" />

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/don-hang/danh-sach">Danh sách</Link>
        <Typography color="text.primary">{id ? 'Chỉnh sửa' : 'Thêm mới'}</Typography>
      </Breadcrumbs>

      <Grid container spacing={2} component="form" onSubmit={form.handleSubmit(handleAddOrEditSubmit)}>
        <Grid item md={9}>
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
            <Typography marginBottom="5px">Thông tin khách hàng *</Typography>

            <Box display="flex" gap="10px">
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="fullName"
                label="Tên khách hàng"
                required
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="phoneNumber"
                label="Số điện thoại"
                required
              />
            </Box>

            <Box display="flex" gap="10px">
              <SearchField
                form={form}
                name="provinceId"
                options={provinceOptions}
                searchValue={provinceSearchValue}
                label="Tìm kiếm tỉnh, thành phố"
                onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setProvinceSearchTerm(e.target.value);
                  setDistrictSearchValue(undefined);
                  setWardSearchValue(undefined);
                }}
                onHandleOptionChange={(option: ValueObject) => {
                  setProvinceId(option.value as number);
                  setProvinceSearchValue(option);
                  setDistrictId(-1);
                  setDistrictSearchValue(undefined);
                  setWardSearchValue(undefined);
                }}
              />

              <SearchField
                form={form}
                name="districtId"
                options={districtOptions}
                searchValue={districtSearchValue}
                label="Tìm kiếm quận, huyện"
                onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDistrictSearchTerm(e.target.value);
                  setWardSearchValue(undefined);
                }}
                onHandleOptionChange={(option: ValueObject) => {
                  setDistrictId(option.value as number);
                  setDistrictSearchValue(option);
                  setWardSearchValue(undefined);
                }}
                disabled={provinceId === -1}
              />
            </Box>

            <Box display="flex" gap="10px" marginBottom="10px">
              <SearchField
                form={form}
                name="wardId"
                options={wardOptions}
                searchValue={wardSearchValue}
                label="Tìm kiếm phường, xã"
                onHandleChange={(e: ChangeEvent<HTMLInputElement>) => setWardSearchTerm(e.target.value)}
                onHandleOptionChange={(option: ValueObject) => {
                  setWardSearchValue(option);
                }}
                disabled={districtId === -1}
              />

              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="street"
                label="Số nhà, đường"
              />
            </Box>
          </Box>

          {/* table */}
          <Box marginTop="20px">
            <Box display="flex" justifyContent="flex-end" marginBottom="10px" gap="10px">
              <Button variant="contained" sx={{ textTransform: 'none' }} onClick={() => setOpenAddProductDialog(true)}>
                Thêm mới
              </Button>

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

              <Dialog
                open={openAddProductDialog}
                onClose={handleAddProductDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
                  Thêm các sản phẩm
                </DialogTitle>
                <DialogContent sx={{ minWidth: '500px' }}>
                  <Box marginTop="10px">
                    <SearchMultipleField
                      form={form}
                      name="productOptions"
                      options={productOptions}
                      label="Tìm kiếm sản phẩm"
                      onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                        handleSearchTermProductChange(e.target.value);
                      }}
                      onHandleMultipleChange={() => {}}
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleAddProductClick();
                      handleAddProductDialogClose();
                    }}
                  >
                    Thêm
                  </Button>
                  <Button variant="outlined" onClick={handleAddProductDialogClose} color="error">
                    Hủy
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
            {/* table */}
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
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length > 0 ? (
                    <>
                      {/* table content */}
                      {rows.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        // handle variation active
                        let variationActive = '';
                        if (row.productItem.productConfigurations) {
                          row.productItem.productConfigurations.forEach((productConfiguration, idx) => {
                            variationActive += productConfiguration.variationOption.value;
                            if (idx !== (row.productItem.productConfigurations?.length as number) - 1) {
                              variationActive += ', ';
                            }
                          });
                        }

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
                            <TableCell sx={{ fontSize: '14px' }}>
                              <Box display="flex" gap="10px">
                                <img
                                  src={row.productItem.imageUrl}
                                  alt={row.productItem.product.name}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                  }}
                                />
                                <Box>
                                  <Typography fontSize="16px">{row.productItem.product.name}</Typography>
                                  <Box>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap="5px"
                                      color={theme.palette.neutral[200]}
                                      sx={{ cursor: 'pointer' }}
                                      onClick={(e: any) => handleVariationMenuClick(e, row)}
                                    >
                                      <Typography>{variationActive}</Typography>
                                      <BsFillCaretDownFillIcon />
                                    </Box>
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={anchorElVariationMenu}
                                      open={openVariationMenu}
                                      onClose={handleVariationMenuClose}
                                      MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                      }}
                                    >
                                      <Box padding="10px">
                                        {variations.map((variation, idx) => (
                                          <Box
                                            key={`variation-item-${idx}`}
                                            display="flex"
                                            gap="10px"
                                            marginBottom="10px"
                                          >
                                            {variation.options.map((option, ix) => {
                                              let SKU = '';
                                              let itemIndex = -1;
                                              if (menuRow) {
                                                itemIndex = menuRow.productItem.product.productItems.findIndex(
                                                  (productItem: any) => productItem.id === menuItemId,
                                                );

                                                if (itemIndex !== -1) {
                                                  SKU = menuRow.productItem.product.productItems[itemIndex]
                                                    .SKU as string;
                                                } else {
                                                  SKU = menuRow.productItem.SKU as string;
                                                }
                                              }

                                              const variationOptionActives = SKU.split('_');

                                              return (
                                                <Button
                                                  variant="outlined"
                                                  key={`variation-option-item-${ix}`}
                                                  sx={{
                                                    bgcolor: theme.palette.common.white,
                                                    color:
                                                      variationOptionActives &&
                                                      variationOptionActives.includes(option.slug)
                                                        ? theme.palette.primary[500]
                                                        : theme.palette.neutral[200],
                                                    textTransform: 'none',
                                                    fontWeight: 400,
                                                    borderColor:
                                                      variationOptionActives &&
                                                      variationOptionActives.includes(option.slug)
                                                        ? theme.palette.primary[500]
                                                        : theme.palette.neutral[600],

                                                    '&:hover': {
                                                      opacity: 0.9,
                                                      bgcolor: theme.palette.common.white,
                                                    },
                                                  }}
                                                  onClick={(e: any) => {
                                                    handleVariationOptionClick(
                                                      variation.id,
                                                      variationOptionActives as string[],
                                                      option.slug,
                                                    );
                                                    e.stopPropagation();
                                                  }}
                                                >
                                                  {option.name}
                                                </Button>
                                              );
                                            })}
                                          </Box>
                                        ))}

                                        <Box marginTop="20px" display="flex" justifyContent="flex-end" gap="10px">
                                          <Button
                                            variant="contained"
                                            sx={{ textTransform: 'none' }}
                                            onClick={(e: any) => {
                                              handleVariationClick(menuRow?.id as number);
                                              handleVariationMenuClose(e);
                                            }}
                                          >
                                            Xác nhận
                                          </Button>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ textTransform: 'none' }}
                                            onClick={handleVariationMenuClose}
                                          >
                                            Hủy
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Menu>
                                  </Box>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontSize: '14px' }}>
                              <Box display="flex" gap="10px">
                                {handleDiscount(row) && (
                                  <Typography
                                    sx={{ color: theme.palette.neutral[300], textDecoration: 'line-through' }}
                                  >
                                    {priceFormat(row.productItem.price)}
                                  </Typography>
                                )}
                                <Typography>
                                  {priceFormat(handleDiscount(row) ? row.productItem.discount : row.productItem.price)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontSize: '14px' }}>
                              <ButtonGroup size="small">
                                <Button
                                  variant="outlined"
                                  onClick={(e: any) => {
                                    handleQuantityClick(index, row.quantity > 1 ? row.quantity - 1 : 1);
                                    e.stopPropagation();
                                  }}
                                  disabled={row.quantity === 1}
                                >
                                  <AiOutlineMinusIcon />
                                </Button>
                                <Button variant="outlined" sx={{ cursor: 'default' }}>
                                  {row.quantity}
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={(e: any) => {
                                    handleQuantityClick(
                                      index,
                                      row.quantity < row.productItem.inventory.quantity
                                        ? row.quantity + 1
                                        : row.productItem.inventory.quantity,
                                    );
                                    e.stopPropagation();
                                  }}
                                  disabled={row.quantity === row.productItem.inventory.quantity}
                                >
                                  <AiOutlinePlusIcon />
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                            <TableCell sx={{ fontSize: '14px' }}>
                              <Typography color={theme.palette.error.main}>
                                {priceFormat(
                                  handleDiscount(row)
                                    ? row.productItem.discount * row.quantity
                                    : row.productItem.price * row.quantity,
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '14px' }}>
                              <Box display="flex" gap="10px">
                                <Tooltip title="Xem chi tiết">
                                  <IconButton onClick={(e: any) => e.stopPropagation()}>
                                    <Link
                                      to={`/${row.productItem.product.category.slug}/${row.productItem.product.slug}`}
                                      target="_blank"
                                    >
                                      <BiDetailIcon style={{ color: theme.palette.info.main }} />
                                    </Link>
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
                      {/* table content */}
                    </>
                  ) : (
                    <TableRow style={{ height: 53 }}>
                      <TableCell colSpan={headCells.length + 1} align="center" sx={{ fontSize: '14px' }}>
                        Không có dữ liệu nào!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
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
                    : `sản phẩm "${rows[deleteRowIndex].productItem.product.name}"`}{' '}
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
          {/* table */}

          {/* note */}
          <Box
            marginTop="10px"
            bgcolor={theme.palette.neutral[1000]}
            padding="20px"
            marginBottom="20px"
            boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
            borderRadius="5px"
          >
            <Box width="400px">
              <InputField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                multiline
                maxRows={4}
                sx={{ width: '350px', marginBottom: '10px' }}
                name="note"
                label="Ghi chú"
              />
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap="10px"
              paddingTop="10px"
              borderTop="1px dashed #ccc"
            >
              <Typography>Tổng số tiền ({rows.length} sản phẩm):</Typography>
              <Typography fontSize="16px" fontWeight={500} color={theme.palette.error.main}>
                {priceFormat(totalPrice)}
              </Typography>
            </Box>
          </Box>
          {/* note */}

          <Box display="flex" gap="20px" marginTop="20px">
            {/* shipping method */}
            <Box
              width="100%"
              bgcolor={theme.palette.neutral[1000]}
              padding="20px"
              marginBottom="20px"
              boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
              borderRadius="5px"
            >
              <Box display="flex" alignItems="center" gap="20px">
                <Box display="flex" alignItems="center" gap="10px">
                  <Typography fontSize="16px">Phương thức giao hàng:</Typography>
                  <Typography fontSize="16px" color={theme.palette.primary[500]}>
                    {shipMethodActive?.name}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{ textTransform: 'none' }}
                  onClick={() => setOpenUpdateShipMethodDialog(true)}
                >
                  Thay đổi
                </Button>

                <Dialog
                  open={openUpdateShipMethodDialog}
                  onClose={handleUpdateShipMethodDialogClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
                    Chọn phương thức giao hàng
                  </DialogTitle>
                  <DialogContent sx={{ minWidth: '400px' }}>
                    {shipMethods.map((shipMethod, index) => (
                      <Box
                        key={`ship-method-item-${index}`}
                        component="label"
                        htmlFor={`ship-method-item-${index}`}
                        display="flex"
                        alignItems="center"
                        gap="10px"
                      >
                        <Radio
                          id={`ship-method-item-${index}`}
                          checked={shipMethodValue === shipMethod.id}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setShipMethodValue(parseInt(e.target.value))}
                          value={shipMethod.id}
                        />
                        <Typography fontWeight={500}>{shipMethod.name}</Typography>
                        <Typography fontWeight={500} color={theme.palette.error.main}>
                          {priceFormat(shipMethod.price)}
                        </Typography>
                      </Box>
                    ))}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const newShipMethodActive = shipMethods.find((shipMethod) => shipMethod.id === shipMethodValue);

                        handleUpdateShipMethodDialogClose();
                        setShipMethodActive(newShipMethodActive);
                        setShipPrice(newShipMethodActive?.price as number);
                      }}
                    >
                      Xác nhận
                    </Button>
                    <Button variant="outlined" onClick={handleUpdateShipMethodDialogClose} color="error">
                      Hủy
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              <Typography fontWeight={500} color={theme.palette.error.main}>
                + {shipMethodActive ? priceFormat(shipMethodActive.price) : '0đ'}
              </Typography>
            </Box>
            {/* shipping method */}

            {/* coupon */}
            <Box
              width="100%"
              bgcolor={theme.palette.neutral[1000]}
              padding="20px"
              marginBottom="20px"
              boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
              borderRadius="5px"
            >
              <Box display="flex" justifyContent="flex-end" alignItems="center" gap="20px">
                <Box display="flex" alignItems="center" gap="10px">
                  <RiCoupon3LineIcon fontSize="20px" color={theme.palette.primary[500]} />
                  <Typography fontSize="16px">Voucher</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <TextField
                    variant="outlined"
                    label="Mã giảm giá"
                    size="small"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setVoucherValue(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleVoucherClick}>
                    Áp dụng
                  </Button>
                </Box>
              </Box>

              <Box marginTop="10px">
                {coupons.map((coupon, index) => (
                  <Box
                    key={`coupon-item-${index}`}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap="10px"
                  >
                    <Typography>{coupon.code}</Typography>

                    <Typography fontWeight={500} color={theme.palette.error.main}>
                      - {priceFormat(coupon.price)}
                    </Typography>

                    <Typography
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',

                        '&:hover': {
                          color: theme.palette.error.main,
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => handleVoucherDelete(index)}
                    >
                      <BiXIcon fontSize="18px" />
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* coupon */}
          </Box>

          {/* payment method */}
          <Box
            bgcolor={theme.palette.neutral[1000]}
            padding="20px"
            marginBottom="20px"
            boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
            borderRadius="5px"
          >
            <Box display="flex" alignItems="center" gap="20px">
              <Typography fontSize="16px">Phương thức thanh toán</Typography>

              <Box display="flex" alignItems="center" gap="10px">
                {paymentMethods.map((paymentMethod, index) => (
                  <Button
                    key={`payment-method-item-${index}`}
                    variant={paymentMethodActive?.id === paymentMethod.id ? 'contained' : 'outlined'}
                    onClick={() => setPaymentMethodActive(paymentMethod)}
                  >
                    {paymentMethod.name}
                  </Button>
                ))}
              </Box>
            </Box>

            <Typography marginTop="20px">{paymentMethodActive?.description}</Typography>
          </Box>
          {/* payment method */}
        </Grid>

        <Grid item md={3}>
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
            <Box display="flex" flexDirection="column" gap="10px">
              <Box display="flex" justifyContent="space-between">
                <Typography color={theme.palette.neutral[300]}>Tổng tiền hàng</Typography>
                <Typography>{priceFormat(totalPrice)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography color={theme.palette.neutral[300]}>Phí vận chuyển</Typography>
                <Typography>+ {priceFormat(shipPrice)}</Typography>
              </Box>

              {totalVoucherPrice > 0 && (
                <Box display="flex" justifyContent="space-between">
                  <Typography color={theme.palette.neutral[300]}>Tổng cộng Voucher giảm giá</Typography>
                  <Typography>- {priceFormat(totalVoucherPrice)}</Typography>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color={theme.palette.neutral[300]}>Tổng thanh toán</Typography>
                <Typography fontSize="20px" fontWeight={500} color={theme.palette.error.main}>
                  {priceFormat(totalPrice + shipPrice - totalVoucherPrice)}
                </Typography>
              </Box>
            </Box>

            <Box marginTop="10px">
              <SelectField
                form={form}
                errorServers={errors}
                setErrorServers={setErrors}
                name="orderStatusId"
                label="Trạng thái"
                valueObjects={statusOptions}
                required
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" gap="10px" marginTop="30px">
              <LoadingButton
                variant="contained"
                loading={isLoading}
                startIcon={id ? <BiEditIcon /> : <FiPlusSquareIcon />}
                loadingPosition="start"
                type="submit"
                sx={{
                  backgroundColor: theme.palette.primary[500],
                  color: theme.palette.neutral[1000],
                }}
              >
                {id ? 'Cập nhật' : 'Thêm mới'}
              </LoadingButton>
              <Button variant="contained" startIcon={<BiResetIcon />} color="error" onClick={handleCancelForm}>
                Hủy
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AddOrEditOrder;
