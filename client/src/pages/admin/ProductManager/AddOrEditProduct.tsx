import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit as BiEditIcon, BiReset as BiResetIcon, BiXCircle as BiXCircleIcon } from 'react-icons/bi';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { IoMdImages as IoMdImagesIcon } from 'react-icons/io';
import { MdExpandMore as MdExpandMoreIcon } from 'react-icons/md';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import slugify from 'slugify';
import * as categoryApi from '../../../apis/categoryApi';
import * as productApi from '../../../apis/productApi';
import * as tagApi from '../../../apis/tagApi';
import * as variationApi from '../../../apis/variationApi';
import * as variationOptionApi from '../../../apis/variationOptionApi';
import InputField from '../../../components/InputField';
import MediaDialog from '../../../components/MediaDialog';
import SearchField from '../../../components/SearchField';
import SelectField from '../../../components/SelectField';
import TextEditor from '../../../components/TextEditor';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { FieldError } from '../../../interfaces/FieldError';
import { ProductInput } from '../../../interfaces/ProductInput';
import { ValueObject } from '../../../interfaces/ValueObject';
import { Category } from '../../../models/Category';
import { Product } from '../../../models/Product';
import { Tag } from '../../../models/Tag';
import { Variation } from '../../../models/Variation';
import { VariationOption } from '../../../models/VariationOption';
import { Theme } from '../../../theme';
import productSchema from '../../../validations/productSchema';
import { BaseResponse } from '../../../interfaces/BaseResponse';
import { showToast } from '../../../slices/toastSlice';
import { useAppDispatch } from '../../../app/hook';

interface ImageItem {
  idx: string;
  imageUrl: string;
  library: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: '10px 20px' }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

const mixArrays = (arr: any[][]) => {
  if (arr.length === 1) {
    return arr[0].map((x: any) => [x]);
  } else {
    let result = [];
    let mix: any = mixArrays(arr.slice(1));
    for (let i = 0; i < arr[0].length; i++) {
      for (let j = 0; j < mix.length; j++) {
        result.push([arr[0][i], ...mix[j]]);
      }
    }
    return result;
  }
};

const AddOrEditProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme: Theme = useTheme();
  const { id } = useParams();

  const [productOptions, setProductOptions] = useState<ValueObject[]>([]);
  const [tagOptions, setTagOptions] = useState<ValueObject[]>([]);

  const [productSearchValues, setProductSearchValues] = useState<ValueObject[]>([]);
  const [tagSearchValues, setTagSearchValues] = useState<ValueObject[]>([]);
  const [variationIdSearchValues, setVariationIdSearchValues] = useState<number[]>([]);
  const [variationOptionSearchValues, setVariationOptionSearchValues] = useState<ValueObject[][]>([]);

  const [variations, setVariations] = useState<Variation[]>([]);
  const [variationOptions, setVariationOptions] = useState<{ id: number; options: ValueObject[] }[]>([]);
  const [variationOptionProductMultiple, setVariationOptionProductMultiple] = useState<ValueObject[][]>([]);
  const [categoryOptions, setCategoryOptions] = useState<ValueObject[]>([]);

  const [isOpenMediaDialog, setIsOpenMediaDialog] = useState<'single' | 'multiple' | 'off'>('off');

  const [idxProductItem, setIdxProductItem] = useState<string>('');
  const [productItems, setProductItems] = useState<ImageItem[]>([]);
  const [imageUrlProduct, setImageUrlProduct] = useState<string>('');

  const [tabActive, setTabActive] = React.useState(0);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<ProductInput>({
    defaultValues: {
      imageUrl: '',
      name: '',
      slug: '',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      categoryId: '',
      shortDescription: '',
      description: '',
      isActive: 1,
      items: [],
      connectIds: [],
      tagIds: [],
    },
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    const getAllVariation = async () => {
      try {
        const res = await variationApi.getAll();
        setVariations(res.data as Variation[]);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllVariation();
  }, [navigate]);

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await categoryApi.getAll();
        const resData = res.data as Category[];
        let data: ValueObject[] = [];

        for (let i = 0; i < resData.length; i++) {
          data.push({ label: resData[i].name, value: resData[i].id });
        }
        setCategoryOptions(data);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllCategory();
  }, [navigate]);

  const handleTabActiveChange = (_e: React.SyntheticEvent, newValue: number) => {
    setTabActive(newValue);
  };

  useEffect(() => {
    // check mode add or edit
    const { pathname } = location;
    const slugArr = pathname.split('/');
    const mode = slugArr[slugArr.length - 2];

    const getOneUser = async () => {
      try {
        const res = await productApi.getOneById(parseInt(id as string));
        const resData = res.data as Product;

        // default variation
        let variationIds: number[] = [];
        let variationOptions: ValueObject[][] = [];
        resData.productItems?.forEach((productItem) => {
          productItem.productConfigurations?.forEach((productConfiguration) => {
            const variationIdIndex = variationIds.findIndex(
              (variationId) => variationId === productConfiguration.variationOption.variationId,
            );

            if (variationIdIndex === -1) {
              variationIds.push(productConfiguration.variationOption.variationId);
              variationOptions.push([
                {
                  label: productConfiguration.variationOption.value,
                  value: productConfiguration.variationOption.id,
                },
              ]);
            } else {
              let variationOptionIndex = -1;
              variationOptions.forEach(
                (variationOptionArr) =>
                  (variationOptionIndex = variationOptionArr.findIndex(
                    (variationOption) => variationOption.value === productConfiguration.variationOption.id,
                  )),
              );

              if (variationOptionIndex === -1) {
                variationOptions[variationIdIndex].push({
                  label: productConfiguration.variationOption.value,
                  value: productConfiguration.variationOption.id,
                });
              }
            }
          });
        });

        setVariationIdSearchValues(variationIds);
        setVariationOptionSearchValues(variationOptions);

        // default product item
        let variationArr: ValueObject[][] = [];
        variationIds.forEach((_variationId, index) => {
          variationArr.push(variationOptions[index]);
        });

        const variationOptionProductArr: ValueObject[][] = variationArr.length > 0 ? mixArrays(variationArr) : [];
        setVariationOptionProductMultiple(variationOptionProductArr);

        const newProductItems: ImageItem[] = [];
        let formProductItems: any[] = [];

        variationOptionProductArr.forEach((variationOptionProducts) => {
          let idx: string = '';
          let sku: string = '';

          for (let i = 0; i < variationOptionProducts.length; i++) {
            idx += variationOptionProducts[i].value;
            sku += slugify(variationOptionProducts[i].label as string, { lower: true, locale: 'vi', trim: true });
            if (i !== variationOptionProducts.length - 1) {
              idx += '-';
              sku += '-';
            }
          }

          resData.productItems?.forEach((productItem) => {
            if (productItem.SKU === sku) {
              newProductItems.push({
                idx,
                imageUrl: productItem.imageUrl as string,
                library: productItem.productImages
                  ? productItem.productImages.map((productImage) => productImage.imageUrl)
                  : [],
              });

              formProductItems.push({
                idx,
                imageUrl: productItem.imageUrl as string,
                library: productItem.productImages
                  ? productItem.productImages.map((productImage) => productImage.imageUrl)
                  : [],
                SKU: productItem.SKU,
                price: productItem.price,
                discount: productItem.discount,
                discountStartDate: productItem.discountStartDate ? productItem.discountStartDate : ' ',
                discountEndDate: productItem.discountEndDate ? productItem.discountEndDate : ' ',
                inventory: {
                  quantity: productItem.inventory.quantity,
                  priceEntry: productItem.inventory.priceEntry,
                  locationCode: productItem.inventory.locationCode,
                },
              });
            }
          });
        });

        setProductItems(newProductItems);

        setImageUrlProduct(resData ? resData.imageUrl : '');

        let defaultProductOptions: ValueObject[] = resData.productConnects
          ? resData.productConnects.map((productConnect) => ({
              label: productConnect.connect.name,
              value: productConnect.connect.id,
            }))
          : [];
        setProductSearchValues(defaultProductOptions);

        let defaultTagOptions: ValueObject[] = resData.productTags
          ? resData.productTags.map((productTag) => ({
              label: productTag.tag.name,
              value: productTag.tag.id,
            }))
          : [];
        setTagSearchValues(defaultTagOptions);

        setTimeout(() => {
          form.reset({
            imageUrl: resData ? resData.imageUrl : '',
            name: resData ? resData.name : '',
            slug: resData ? resData.slug : '',
            weight: resData.weight ? resData.weight : 0,
            length: resData.length ? resData.length : 0,
            width: resData.width ? resData.width : 0,
            height: resData.height ? resData.height : 0,
            categoryId: resData ? resData.category.id : '',
            isActive: resData ? resData.isActive : 1,
            shortDescription: resData.shortDescription ? resData.shortDescription : '',
            description: resData.description ? resData.description : '',
            items: formProductItems,
            connectIds:
              defaultProductOptions.length > 0
                ? (defaultProductOptions.map((productOption) => productOption.value) as number[])
                : [],
            tagIds:
              defaultTagOptions.length > 0 ? (defaultTagOptions.map((tagOption) => tagOption.value) as number[]) : [],
          });
        }, 500);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 404 || data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    if (mode === 'chinh-sua') {
      getOneUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, form, id, location, navigate, variations]);

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

  const handleSearchTermVariationOptionChange = async (variationId: number, variationOptionSearchTerm: string) => {
    try {
      const res = await variationOptionApi.getListBySearchTermAndVariationId(variationId, variationOptionSearchTerm);
      const resData = res.data as VariationOption[];
      let data: ValueObject[] = [];

      for (let i = 0; i < resData.length; i++) {
        data.push({ label: resData[i].value, value: resData[i].id });
      }

      const newVariationOptions = [...variationOptions];
      const variationOptionIndex = newVariationOptions.findIndex(
        (variationOption) => variationOption.id === (variationId as number),
      );

      if (variationOptionIndex !== -1) {
        newVariationOptions[variationOptionIndex].options = data;
      } else {
        newVariationOptions.push({ id: variationId as number, options: data });
      }

      setVariationOptions(newVariationOptions);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleMultipleVariationOptionChange = () => {
    let variationArr: ValueObject[][] = [];
    const newVariationOptionSearchValues = [...variationOptionSearchValues];

    for (let i = 0; i < variations.length; i++) {
      const variationOptionArr: ValueObject[] = form.getValues(`variation${variations[i].id}`) as ValueObject[];

      if (variationOptionArr && variationOptionArr.length > 0) {
        variationArr.push(variationOptionArr);
      }

      const variationIdIndex = variationIdSearchValues.findIndex((variationId) => variationId === variations[i].id);
      newVariationOptionSearchValues[variationIdIndex] = variationOptionArr;
    }
    setVariationOptionSearchValues(newVariationOptionSearchValues);

    const variationOptionProductArr: ValueObject[][] = variationArr.length > 0 ? mixArrays(variationArr) : [];
    setVariationOptionProductMultiple(variationOptionProductArr);

    const newProductItems: ImageItem[] = [];
    variationOptionProductArr.forEach((variationOptionProducts) => {
      let idx: string = '';

      for (let i = 0; i < variationOptionProducts.length; i++) {
        idx += variationOptionProducts[i].value;
        if (i !== variationOptionProducts.length - 1) {
          idx += '-';
        }
      }

      newProductItems.push({ idx, imageUrl: '', library: [] });
    });

    setProductItems(newProductItems);

    const formProductItems = newProductItems.map((newProductItem) => ({
      ...newProductItem,
      SKU: '',
      price: 0,
      discount: 0,
      discountStartDate: ' ',
      discountEndDate: ' ',
      inventory: {
        quantity: 0,
        priceEntry: 1000,
        locationCode: '',
      },
    }));
    form.setValue('items', formProductItems);
  };

  const handleSearchTermTagChange = async (tagSearchTerm: string) => {
    try {
      const res = await tagApi.getListBySearchTerm(tagSearchTerm);
      const resData = res.data as Tag[];
      let data: ValueObject[] = [];

      for (let i = 0; i < resData.length; i++) {
        data.push({ label: resData[i].name, value: resData[i].id });
      }

      setTagOptions(data);
    } catch (error: any) {
      const { data } = error.response;
      if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleOpenMediaDialog = (type: 'single' | 'multiple' | 'off', idx: string) => {
    setIsOpenMediaDialog(type);
    setIdxProductItem(idx);
  };

  const handleConfirmSingleDialog = (newImageUrl: string) => {
    if (idxProductItem === '-1') {
      setImageUrlProduct(newImageUrl);
      form.setValue('imageUrl', newImageUrl);
      return;
    }

    const newProductItems = [...productItems];
    const newProductItemIndex = newProductItems.findIndex((newProductItem) => newProductItem.idx === idxProductItem);

    if (newProductItemIndex !== -1) {
      newProductItems[newProductItemIndex].imageUrl = newImageUrl;
    }

    setProductItems(newProductItems);
    form.setValue(`items[${newProductItemIndex}].imageUrl`, newImageUrl);
  };

  const handleConfirmMultipleDialog = (newImageUrls: string[]) => {
    const newProductItems = [...productItems];
    const newProductItemIndex = newProductItems.findIndex((newProductItem) => newProductItem.idx === idxProductItem);

    if (newProductItemIndex !== -1) {
      newProductItems[newProductItemIndex].library = newImageUrls;
    }

    setProductItems(newProductItems);
    form.setValue(`items[${newProductItemIndex}].library`, newImageUrls);
  };

  const handleRemoveImageUrlProduct = () => {
    setImageUrlProduct('');
    form.setValue('imageUrl', '');
  };

  const handleRemoveImageUrl = (idx: string) => {
    const newProductItems = [...productItems];
    const newProductItemIndex = newProductItems.findIndex((newProductItem) => newProductItem.idx === idx);
    if (newProductItemIndex !== -1) {
      newProductItems[newProductItemIndex].imageUrl = '';
      setProductItems(newProductItems);
    }
  };

  const handleRemoveLibraryItem = (idx: string, imageUrl: string) => {
    const newProductItems = [...productItems];
    const newProductItemIndex = newProductItems.findIndex((newProductItem) => newProductItem.idx === idx);
    if (newProductItemIndex !== -1) {
      const newLibraryItemIndex = newProductItems[newProductItemIndex].library.findIndex(
        (newLibraryItem) => newLibraryItem === imageUrl,
      );

      if (newLibraryItemIndex !== -1) {
        newProductItems[newProductItemIndex].library.splice(newLibraryItemIndex, 1);
        setProductItems(newProductItems);
      }
    }
  };

  const handleAddOrEditSubmit = async (values: any) => {
    setIsLoading(true);

    variations.forEach((variation) => {
      delete values[`variation${variation.id}`];
    });

    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        values[key] = undefined;
      }
    }

    try {
      let res: BaseResponse;
      if (id) {
        res = await productApi.updateOne(parseInt(id), values);
      } else {
        res = await productApi.addOne(values);
      }

      dispatch(
        showToast({
          page: 'product',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'productId' },
        }),
      );
      setIsLoading(false);
      navigate('/quan-tri/san-pham/danh-sach');
    } catch (error: any) {
      setIsLoading(false);

      const { data } = error.response;
      if (data.code === 403 || data.code === 400) {
        setErrors(data.errors);
        dispatch(
          showToast({
            page: 'addOrEditProduct',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'addOrEditProductId' },
          }),
        );
      }

      if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleResetForm = () => {
    form.reset();
    setImageUrlProduct(form.getValues('imageUrl') as string);
  };

  return (
    <>
      <TitlePage title={`${id ? 'Chỉnh sửa' : 'Thêm mới'} sản phẩm`} />
      <ToastNotify name="addOrEditProduct" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/san-pham/danh-sach">Danh sách</Link>
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
            <InputField
              form={form}
              errorServers={errors}
              name="name"
              label="Tên sản phẩm"
              onHandleChange={(e: ChangeEvent<HTMLInputElement>) =>
                form.setValue('slug', slugify(e.target.value, { lower: true, locale: 'vi', trim: true }))
              }
              required
            />
            <InputField form={form} errorServers={errors} name="slug" label="Đường dẫn" required />

            <Box marginTop="20px">
              <Typography>Dữ liệu sản phẩm *</Typography>
              <Box marginTop="10px" flexGrow={1} display="flex">
                <Tabs
                  orientation="vertical"
                  value={tabActive}
                  onChange={handleTabActiveChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                  <Tab label="Giao hàng" {...a11yProps(0)} />
                  <Tab label="Các sản phẩm được kết nối" {...a11yProps(1)} />
                  <Tab label="Các thuộc tính" {...a11yProps(2)} />
                  <Tab label="Các biến thể" {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={tabActive} index={0}>
                  <InputField
                    form={form}
                    errorServers={errors}
                    name="weight"
                    label="Trọng lượng"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ min: 0, max: 10, step: 0.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start">KG</InputAdornment> }}
                    required
                  />

                  <Box display="flex" gap="10px">
                    <InputField
                      form={form}
                      errorServers={errors}
                      name="length"
                      label="Chiều dài"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 9999 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">CM</InputAdornment> }}
                      required
                    />

                    <InputField
                      form={form}
                      errorServers={errors}
                      name="width"
                      label="Chiều rộng"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 9999 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">CM</InputAdornment> }}
                      required
                    />

                    <InputField
                      form={form}
                      errorServers={errors}
                      name="height"
                      label="Chiều cao"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ min: 0, max: 9999 }}
                      InputProps={{ startAdornment: <InputAdornment position="start">CM</InputAdornment> }}
                      required
                    />
                  </Box>
                </TabPanel>
                <TabPanel value={tabActive} index={1}>
                  <SearchField
                    form={form}
                    name="connectIds"
                    options={productOptions}
                    searchValues={productSearchValues}
                    label="Tìm kiếm sản phẩm"
                    onHandleChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchTermProductChange(e.target.value)}
                  />
                </TabPanel>
                <TabPanel value={tabActive} index={2}>
                  {variations.map((variation, index) => (
                    <SearchField
                      key={`variation-${index}`}
                      form={form}
                      name={`variation${variation.id}`}
                      options={variationOptions.find((variationOption) => variationOption.id === variation.id)?.options}
                      searchValues={
                        variationIdSearchValues.findIndex((variationId) => variationId === variation.id) !== -1
                          ? variationOptionSearchValues[
                              variationIdSearchValues.findIndex((variationId) => variationId === variation.id)
                            ]
                          : []
                      }
                      label={`Tìm kiếm ${variation.name.toLowerCase()}`}
                      onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                        handleSearchTermVariationOptionChange(variation.id, e.target.value);
                      }}
                      onHandleMultipleChange={handleMultipleVariationOptionChange}
                      keyNumber={2}
                    />
                  ))}
                </TabPanel>
                <TabPanel value={tabActive} index={3}>
                  {variationOptionProductMultiple.length > 0 ? (
                    variationOptionProductMultiple.map((variationOptionProducts, index) => {
                      let name: string = '',
                        sku: string = '',
                        idx: string = '';

                      for (let i = 0; i < variationOptionProducts.length; i++) {
                        name += variationOptionProducts[i].label;
                        sku += variationOptionProducts[i].label;
                        idx += variationOptionProducts[i].value;
                        if (i !== variationOptionProducts.length - 1) {
                          name += ' x ';
                          sku += ' ';
                          idx += '-';
                        }
                      }

                      const productItem = productItems.find((productItem) => productItem.idx === idx);
                      const SKU = slugify(sku, { lower: true, locale: 'vi', trim: true });
                      form.setValue(`items[${index}].SKU`, SKU);

                      return (
                        <Accordion key={`variation-option-product-${index}`}>
                          <AccordionSummary
                            expandIcon={<MdExpandMoreIcon fontSize="20px" />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography>{name}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {productItem?.imageUrl ? (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                  width: '120px',
                                  height: '120px',
                                  border: '1px solid #ccc',
                                  borderRadius: '5px',
                                  position: 'relative',
                                  '&:hover div': {
                                    display: 'block',
                                  },
                                }}
                              >
                                <img
                                  src={productItem?.imageUrl}
                                  alt={name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                />
                                <Box
                                  display="none"
                                  position="absolute"
                                  bgcolor={theme.palette.common.white}
                                  sx={{
                                    top: '-8px',
                                    right: '-8px',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',

                                    '&:hover': {
                                      color: theme.palette.error.main,
                                      cursor: 'pointer',
                                    },
                                  }}
                                  onClick={() => handleRemoveImageUrl(idx)}
                                >
                                  <BiXCircleIcon fontSize="22px" />
                                </Box>
                              </Box>
                            ) : (
                              <Tooltip title="Tải lên một hình ảnh">
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  sx={{
                                    width: '120px',
                                    height: '120px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => handleOpenMediaDialog('single', idx)}
                                >
                                  <IoMdImagesIcon fontSize="60px" style={{ color: theme.palette.neutral[400] }} />
                                </Box>
                              </Tooltip>
                            )}

                            <Box margin="15px 0">
                              <Typography fontWeight={500} fontSize="13px">
                                Thư viện hình ảnh biến thể
                              </Typography>

                              <Box
                                margin="15px 0"
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="center"
                                gap="10px"
                                flexWrap="wrap"
                              >
                                {productItem?.library.map((imageUrl, i) => (
                                  <Box
                                    key={`library-${i}`}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{
                                      width: '130px',
                                      height: '130px',
                                      border: '1px solid #ccc',
                                      borderRadius: '5px',
                                      position: 'relative',
                                      '&:hover div': {
                                        display: 'block',
                                      },
                                    }}
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={name + 'library' + i}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                    />
                                    <Box
                                      display="none"
                                      position="absolute"
                                      bgcolor={theme.palette.common.white}
                                      sx={{
                                        top: '-8px',
                                        right: '-8px',
                                        borderRadius: '50%',
                                        width: '22px',
                                        height: '22px',

                                        '&:hover': {
                                          color: theme.palette.error.main,
                                          cursor: 'pointer',
                                        },
                                      }}
                                      onClick={() => handleRemoveLibraryItem(idx, imageUrl)}
                                    >
                                      <BiXCircleIcon fontSize="22px" />
                                    </Box>
                                  </Box>
                                ))}
                              </Box>

                              <Box display="flex" justifyContent="flex-end">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleOpenMediaDialog('multiple', idx)}
                                >
                                  Thêm ảnh thư viện
                                </Button>
                              </Box>
                            </Box>

                            <Box display="flex" gap="20px">
                              <InputField
                                form={form}
                                errorServers={errors}
                                name={`items[${index}].price`}
                                label="Giá"
                                type="number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ min: 0, step: 1000 }}
                                InputProps={{ startAdornment: <InputAdornment position="start">VNĐ</InputAdornment> }}
                                required
                              />

                              <InputField
                                form={form}
                                errorServers={errors}
                                name={`items[${index}].discount`}
                                label="Giá ưu đãi"
                                type="number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ min: 0, step: 1000 }}
                                InputProps={{ startAdornment: <InputAdornment position="start">VNĐ</InputAdornment> }}
                              />
                            </Box>

                            <Box display="flex" gap="20px">
                              <InputField
                                form={form}
                                errorServers={errors}
                                name={`items[${index}].discountStartDate`}
                                label="Ngày bắt đầu ưu đãi"
                                type="date"
                              />

                              <InputField
                                form={form}
                                errorServers={errors}
                                name={`items[${index}].discountEndDate`}
                                label="Ngày kết thúc ưu đãi"
                                type="date"
                              />
                            </Box>
                            <Box display="flex" gap="10px">
                              <InputField
                                form={form}
                                errorServers={errors}
                                name={`items[${index}].inventory.quantity`}
                                label="Số lượng trong kho"
                                type="number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ min: 0, max: 9999 }}
                                required
                              />

                              <InputField
                                form={form}
                                errorServers={errors}
                                name={`items[${index}].inventory.priceEntry`}
                                label="Giá nhập một sản phẩm"
                                type="number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ min: 1000, step: 1000 }}
                                InputProps={{ startAdornment: <InputAdornment position="start">VNĐ</InputAdornment> }}
                                required
                              />
                            </Box>

                            <InputField
                              form={form}
                              errorServers={errors}
                              name={`items[${index}].inventory.locationCode`}
                              label="Mã vị trí"
                              required
                            />
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                  ) : (
                    <Alert severity="warning">
                      <AlertTitle>Cảnh báo</AlertTitle>
                      Vui lòng thêm các thuộc tính sản phẩm
                    </Alert>
                  )}
                </TabPanel>
              </Box>
            </Box>

            <Box marginTop="20px">
              <Typography marginBottom="5px">Mô tả ngắn</Typography>
              <TextEditor
                height="400px"
                data={form.getValues('shortDescription') as string}
                onHandleChange={(data: string) => form.setValue('shortDescription', data)}
              />
            </Box>

            <Box marginTop="20px">
              <Typography marginBottom="5px">Mô tả</Typography>
              <TextEditor
                height="600px"
                data={form.getValues('description') as string}
                onHandleChange={(data: string) => form.setValue('description', data)}
              />
            </Box>
          </Box>
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
            <Box>
              <Typography marginBottom="5px">Ảnh sản phẩm *</Typography>
              {imageUrlProduct ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: '100%',
                    paddingTop: 'calc(100% - 2px)',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    position: 'relative',
                    backgroundImage: `url(${imageUrlProduct})`,
                    backgroundSize: 'cover',
                    '&:hover div': {
                      display: 'block',
                    },
                  }}
                >
                  <Box
                    display="none"
                    position="absolute"
                    bgcolor={theme.palette.common.white}
                    sx={{
                      top: '-10px',
                      right: '-10px',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',

                      '&:hover': {
                        color: theme.palette.error.main,
                        cursor: 'pointer',
                      },
                    }}
                    onClick={handleRemoveImageUrlProduct}
                  >
                    <BiXCircleIcon fontSize="30px" />
                  </Box>
                </Box>
              ) : (
                <Tooltip title="Tải lên một hình ảnh">
                  <Box
                    sx={{
                      width: '100%',
                      paddingTop: 'calc(100% - 2px)',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => handleOpenMediaDialog('single', '-1')}
                  >
                    <IoMdImagesIcon
                      fontSize="100px"
                      style={{
                        color: theme.palette.neutral[400],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translateX(-50%) translateY(-50%)',
                      }}
                    />
                  </Box>
                </Tooltip>
              )}
            </Box>

            <Box marginTop="20px">
              <SelectField
                form={form}
                errorServers={errors}
                name="categoryId"
                label="Danh mục sản phẩm"
                valueObjects={categoryOptions}
                required
              />
            </Box>

            <Box marginTop="20px">
              <SearchField
                form={form}
                name="tagIds"
                options={tagOptions}
                searchValues={tagSearchValues}
                label="Tim kiếm từ khóa sản phẩm"
                onHandleChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleSearchTermTagChange(e.target.value);
                }}
                keyNumber={2}
              />
            </Box>

            <Box marginTop="20px">
              <SelectField
                form={form}
                errorServers={errors}
                name="isActive"
                label="Trạng thái"
                valueObjects={[
                  { label: 'Ẩn', value: 0 },
                  { label: 'Hiện', value: 1 },
                ]}
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
              <Button variant="contained" startIcon={<BiResetIcon />} color="secondary" onClick={handleResetForm}>
                Làm lại
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <MediaDialog
        title={isOpenMediaDialog === 'single' ? 'Hình ảnh biến thể' : 'Thư viện hình ảnh biến thể'}
        isOpen={isOpenMediaDialog !== 'off'}
        handleClose={() => setIsOpenMediaDialog('off')}
        selectedValues={
          isOpenMediaDialog === 'single'
            ? idxProductItem === '-1'
              ? [form.getValues('imageUrl') as string]
              : [productItems.find((productItem) => productItem.idx === idxProductItem)?.imageUrl as string]
            : [
                ...(!!productItems.find((productItem) => productItem.idx === idxProductItem)
                  ? (productItems.find((productItem) => productItem.idx === idxProductItem)?.library as string[])
                  : []),
              ]
        }
        handleConfirm={isOpenMediaDialog === 'single' ? handleConfirmSingleDialog : handleConfirmMultipleDialog}
        multiple={isOpenMediaDialog === 'multiple'}
      />
    </>
  );
};

export default AddOrEditProduct;
