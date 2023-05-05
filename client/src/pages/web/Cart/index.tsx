import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineMinus as AiOutlineMinusIcon, AiOutlinePlus as AiOutlinePlusIcon } from 'react-icons/ai';
import { BiDetail as BiDetailIcon, BiTrashAlt as BiTrashAltIcon } from 'react-icons/bi';
import { BsFillCaretDownFill as BsFillCaretDownFillIcon } from 'react-icons/bs';
import { MdOutlineRemoveShoppingCart as MdOutlineRemoveShoppingCartIcon } from 'react-icons/md';

import { Link, useNavigate } from 'react-router-dom';
import * as cartItemApi from '../../../apis/cartItemApi';
import { useAppDispatch } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import { HeadCell } from '../../../interfaces/HeadCell';
import { CartItem } from '../../../models/CartItem';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import { toDate } from '../../../utils/date';
import { priceFormat } from '../../../utils/format';
import { setIsReload } from '../../../slices/globalSlice';

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CartItem[]>([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number>(-1);
  const [reload, setReload] = useState<boolean>(false);
  const [selectedArr, setSelectedArr] = useState<number[]>([]);

  const [variations, setVariations] = useState<{ id: number; options: { name: string; slug: string }[] }[]>([]);
  const [menuRow, setMenuRow] = useState<CartItem>();
  const [menuItemId, setMenuItemId] = useState<number>();

  const [totalPrice, setTotalPrice] = useState<number>(0);

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
      label: 'Số tiền',
      numeric: false,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  useEffect(() => {
    setIsLoading(true);

    const getAllCartItem = async () => {
      try {
        const res = await cartItemApi.getAll();

        setRows(res.data as CartItem[]);
        setIsLoading(false);
      } catch (error: any) {
        const { data } = error.response;
        setIsLoading(false);
        if (data.code === 401) {
          dispatch(
            showToast({
              page: 'login',
              type: 'error',
              message: 'Vui lòng đăng nhập tài khoản của bạn',
              options: { theme: 'colored', toastId: 'loginId' },
            }),
          );
          navigate('/dang-nhap');
        } else if (data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllCartItem();
  }, [dispatch, navigate, reload]);

  const handleUpdateTotalPrice = (rowArr: CartItem[]) => {
    let newTotalPrice = 0;
    rowArr.forEach((row) => {
      newTotalPrice += handleDiscount(row)
        ? row.quantity * row.productItem.discount
        : row.quantity * row.productItem.price;
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

    const selectedRows = rows.filter((row) => newSelectedArr.includes(row.id));
    handleUpdateTotalPrice(selectedRows);
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
          page: 'cart',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'cartId' },
        }),
      );
      setReload(!reload);
      setSelectedArr([]);
      setDeleteRowIndex(-1);
      dispatch(setIsReload());
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'cart',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'cartId' },
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
          page: 'cart',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'cartId' },
        }),
      );
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        dispatch(
          showToast({
            page: 'cart',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'cartId' },
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

    const selectedRows = newRows.filter((row) => selectedArr.includes(row.id));
    handleUpdateTotalPrice(selectedRows);

    // update server
    try {
      const res = await cartItemApi.changeQuantity(newRows[index].id, { quantity });
      dispatch(
        showToast({
          page: 'cart',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'cartId' },
        }),
      );
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        dispatch(
          showToast({
            page: 'cart',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'cartId' },
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

  const handleCheckoutClick = () => {
    const checkouts: CartItem[] = [];
    rows.forEach((row) => {
      selectedArr.forEach((selected) => {
        if (row.id === selected) {
          checkouts.push(row);
        }
      });
    });

    navigate('/thanh-toan', { state: { checkouts, totalPrice } });
  };

  return (
    <>
      <TitlePage title="Giỏ hàng" />
      <ToastNotify name="cart" />

      <Box bgcolor={theme.palette.neutral[950]} padding="20px 0">
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <Typography color={theme.palette.primary[500]}>Giỏ hàng</Typography>
          </Breadcrumbs>

          {!isLoading && (
            <>
              {rows.length === 0 ? (
                <Box display="flex" justifyContent="center" height="275px">
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="20px">
                    <MdOutlineRemoveShoppingCartIcon fontSize="80px" color={theme.palette.error.main} />
                    <Typography fontSize="20px">Giỏ hàng của bạn còn trống</Typography>
                    <Link to="/">
                      <Button variant="contained" sx={{ minWidth: '200px' }}>
                        Về trang chủ
                      </Button>
                    </Link>
                  </Box>
                </Box>
              ) : (
                <>
                  {/* table */}
                  <Box marginTop="20px">
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
                                      {priceFormat(
                                        handleDiscount(row) ? row.productItem.discount : row.productItem.price,
                                      )}
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

                  {/* total */}
                  <Box
                    marginTop="20px"
                    bgcolor={theme.palette.neutral[1000]}
                    padding="20px"
                    marginBottom="20px"
                    boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
                    borderRadius="5px"
                  >
                    {/* price discount */}
                    {/* price discount */}

                    {/* price */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      marginTop="10px"
                      paddingTop="10px"
                      borderTop="1px dashed #ccc"
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<BiTrashAltIcon />}
                        onClick={() => handleDeleteRowIndex(-1)}
                      >
                        Xóa ({selectedArr.length})
                      </Button>

                      <Box display="flex" alignItems="center" gap="10px">
                        <Box display="flex" alignItems="center" gap="10px">
                          <Typography fontSize="16px">Tổng thanh toán ({selectedArr.length} sản phẩm):</Typography>
                          <Typography fontSize="18px" fontWeight={500} color={theme.palette.error.main}>
                            {priceFormat(totalPrice)}
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          size="large"
                          sx={{ minWidth: '150px' }}
                          onClick={handleCheckoutClick}
                          disabled={selectedArr.length === 0}
                        >
                          Mua hàng
                        </Button>
                      </Box>
                    </Box>
                    {/* price */}
                  </Box>
                  {/* total */}
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Cart;
