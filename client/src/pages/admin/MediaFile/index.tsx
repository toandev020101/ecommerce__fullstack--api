import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileAdd as AiOutlineFileAddIcon } from 'react-icons/ai';
import {
  BiChevronLeft as BiChevronLeftIcon,
  BiChevronRight as BiChevronRightIcon,
  BiSearchAlt as BiSearchAltIcon,
  BiTrashAlt as BiTrashAltIcon,
  BiX as BiXIcon,
} from 'react-icons/bi';
import { BsFillCheckSquareFill as BsFillCheckSquareFillIcon } from 'react-icons/bs';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as mediaApi from '../../../apis/mediaApi';
import { useAppDispatch } from '../../../app/hook';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { Media } from '../../../models/Media';
import { showToast } from '../../../slices/toastSlice';
import { Theme } from '../../../theme';
import { dateToString, monthToString, toDate } from '../../../utils/date';

const limit = 20;
const sort = 'id';
const order = 'desc';

const InfoDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const theme: Theme = useTheme();

  return (
    <p style={{ color: theme.palette.neutral[300] }}>
      <span style={{ fontWeight: 500 }}>{label}:</span> {value}
    </p>
  );
};

const MediaFile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();

  const [type, setType] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dates, setDates] = useState<{ label: string; value: string }[]>([]);

  const [page, setPage] = useState<number>(0);
  const [medias, setMedias] = useState<Media[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const [selectedArr, setSelectedArr] = useState<number[]>([]);
  const [modeSelect, setModeSelect] = useState<boolean>(false);

  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const [openDetailIndexDialog, setOpenDetailIndexDialog] = useState<number>(-1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    const getAllDate = async () => {
      try {
        const res = await mediaApi.getAllDate();

        const resData = res.data as Date[];
        let newDates: { label: string; value: string }[] = [];
        for (let i = 0; i < resData.length; i++) {
          const newDate = toDate(resData[i]);
          const month = newDate.getMonth();

          const year = newDate.getFullYear();
          const label = `${monthToString(month)} ${year}`;
          const dateIndex = newDates.findIndex((dateItem) => dateItem.label === label);

          if (dateIndex === -1) {
            newDates.push({
              label,
              value: resData[i].toString(),
            });
          }
        }
        setDates(newDates);
      } catch (error: any) {
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };
    getAllDate();
  }, [navigate]);

  useEffect(() => {
    const getPaginationMedia = async () => {
      setIsLoading(true);
      try {
        const res = await mediaApi.getPaginationAndUser({
          _limit: limit,
          _page: page,
          _sort: sort,
          _order: order,
          type,
          date,
          searchTerm,
        });
        setMedias(res.data as Media[]);
        setTotal(res.pagination?._total as number);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        if (error.response) {
          const { data } = error.response;
          if (data.code === 401 || data.code === 403 || data.code === 500) {
            navigate(`/error/${data.code}`);
          }
        }
      }
    };
    getPaginationMedia();
  }, [date, navigate, page, searchTerm, type, reload]);

  useEffect(() => {
    if (files.length > 0) {
      // upload files
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const uploadFiles = async () => {
        try {
          const res = await mediaApi.addAny(formData);

          dispatch(
            showToast({
              page: 'mediaFile',
              type: 'success',
              message: res.message,
              options: { theme: 'colored', toastId: 'mediaFileId' },
            }),
          );

          setOpenAddDialog(false);
          setReload(!reload);
        } catch (error: any) {
          const { data } = error.response;
          if (data.code === 400) {
            dispatch(
              showToast({
                page: 'mediaFile',
                type: 'error',
                message: data.message,
                options: { theme: 'colored', toastId: 'mediaFileId' },
              }),
            );
          } else if (data.code === 401 || data.code === 403 || data.code === 500) {
            navigate(`/error/${data.code}`);
          }
        }
      };

      uploadFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, files]);

  const handleTypeFilter = (e: SelectChangeEvent) => {
    setType(e.target.value);
    setPage(0);
  };

  const handleDateFilter = (e: SelectChangeEvent) => {
    setDate(e.target.value);
    setPage(0);
  };

  const handleResetFilterClick = () => {
    setType('');
    setDate('');
    setPage(0);
  };

  const handleModeSelectClick = () => {
    setModeSelect(!modeSelect);
    setSelectedArr([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 500);
    setPage(0);
  };

  const handleMediaClick = (id: number) => {
    if (modeSelect) {
      const selectedIndex = selectedArr.indexOf(id);
      const newSelectArr = [...selectedArr];

      if (selectedIndex === -1) {
        newSelectArr.push(id);
      } else {
        newSelectArr.splice(selectedIndex, 1);
      }
      setSelectedArr(newSelectArr);
    } else {
      const mediaIndex = medias.findIndex((media) => media.id === id);
      setOpenDetailIndexDialog(mediaIndex);
    }
  };

  const handleFileUrlCopy = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        dispatch(
          showToast({
            page: 'mediaFile',
            type: 'success',
            message: 'Đã sao chép nội dung vào clipboard',
            options: { theme: 'colored', toastId: 'mediaFileId' },
          }),
        );
      })
      .catch((_error: any) => {
        dispatch(
          showToast({
            page: 'mediaFile',
            type: 'error',
            message: 'Lỗi khi sao chép nội dung',
            options: { theme: 'colored', toastId: 'mediaFileId' },
          }),
        );
      });
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files);
  };

  const handleDetailDialogClose = () => {
    setOpenDetailIndexDialog(-1);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteMedia = async () => {
    try {
      const res = await mediaApi.removeAny(selectedArr);

      dispatch(
        showToast({
          page: 'mediaFile',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'mediaFileId' },
        }),
      );

      setReload(!reload);
      setModeSelect(false);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'mediaFile',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'mediaFileId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  return (
    <>
      <TitlePage title="Kho lưu trữ hình ảnh, video" />
      <ToastNotify name="mediaFile" />

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
        {/* header list */}
        <Box display="flex" justifyContent="space-between">
          {/* left */}
          <Box display="flex" gap="10px">
            {/* select */}
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel id="select-type" sx={{ fontSize: '15px' }}>
                Chọn loại
              </InputLabel>
              <Select
                labelId="select-type"
                id="select"
                value={type}
                label="Chọn loại"
                onChange={handleTypeFilter}
                sx={{ fontSize: '15px' }}
              >
                <MenuItem value="">Chọn loại</MenuItem>
                <MenuItem value="0">Hình ảnh</MenuItem>
                <MenuItem value="1">Video</MenuItem>
              </Select>
            </FormControl>
            {/* select */}

            {/* select */}
            <FormControl size="small" sx={{ minWidth: '180px' }}>
              <InputLabel id="select-date" sx={{ fontSize: '15px' }}>
                Chọn ngày đăng
              </InputLabel>
              <Select
                labelId="select-date"
                id="select"
                value={date}
                label="Chọn ngày đăng"
                onChange={handleDateFilter}
                sx={{ fontSize: '15px' }}
              >
                <MenuItem value="">Chọn ngày đăng</MenuItem>
                {dates.map((dateItem, index) => (
                  <MenuItem key={`date-item-${index}`} value={dateItem.value}>
                    {dateItem.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* select */}

            {(type !== '' || date !== '') && (
              <Button variant="outlined" color="error" startIcon={<BiTrashAltIcon />} onClick={handleResetFilterClick}>
                Xóa bộ lọc
              </Button>
            )}

            <Button variant="outlined" color="primary" onClick={handleModeSelectClick}>
              {modeSelect ? 'Hủy bỏ' : 'Chọn nhiều'}
            </Button>

            {selectedArr.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<BiTrashAltIcon />}
                onClick={() => setOpenDeleteDialog(true)}
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
              label="Tìm kiếm file media"
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
              onChange={handleSearchChange}
            />

            <Button
              variant="contained"
              startIcon={<FiPlusSquareIcon />}
              sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
              onClick={() => setOpenAddDialog(true)}
            >
              Thêm mới
            </Button>
          </Box>
          {/* right */}
        </Box>
        {/* header list */}
      </Box>

      {/* list content */}
      <Box display="grid" gridTemplateColumns="repeat(8,1fr)" gap="10px">
        {medias.map((media, index) => (
          <Box
            key={`media-${index}`}
            width="100%"
            sx={{
              border: selectedArr.includes(media.id) ? `2px solid ${theme.palette.secondary[500]}` : '1px solid #ccc',
              borderRadius: '2px',
              bgcolor: theme.palette.neutral[900],
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => handleMediaClick(media.id)}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" sx={{ paddingBottom: '100%' }} />
            ) : (
              <img
                src={media.fileUrl}
                alt={media.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: modeSelect ? 0.6 : 1,
                }}
              />
            )}

            {selectedArr.includes(media.id) && (
              <BsFillCheckSquareFillIcon
                color={theme.palette.secondary[500]}
                fontSize="22px"
                style={{
                  position: 'absolute',
                  top: '-11px',
                  right: '-8px',
                  backgroundColor: theme.palette.neutral[1000],
                }}
              />
            )}
          </Box>
        ))}
      </Box>
      {/* list content */}

      <Box display="flex" alignItems="center" flexDirection="column" marginTop="30px" gap="20px">
        <Typography sx={{ color: theme.palette.neutral[300] }}>
          Đang hiển thị {medias.length} của {total} file media
        </Typography>

        {medias.length < total && (
          <LoadingButton
            variant="contained"
            loading={isLoading}
            loadingIndicator="Loading..."
            component="label"
            sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
            onClick={() => setPage(page + 1)}
          >
            Xem thêm
          </LoadingButton>
        )}
      </Box>

      {/* add dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">Thêm mới file media</Typography>

            <IconButton onClick={handleAddDialogClose} color="error">
              <BiXIcon fontSize="25px" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* upload */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            color={theme.palette.neutral[300]}
            width="100%"
            height="100%"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="400px"
              width="600px"
              gap="20px"
              sx={{ border: `2px dashed ${theme.palette.primary[500]}`, bgcolor: theme.palette.neutral[900] }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Typography variant="h3">Thả các tệp để tải lên</Typography>
              <Typography variant="h5">Hoặc</Typography>
              <LoadingButton
                variant="contained"
                loading={isLoading}
                startIcon={<AiOutlineFileAddIcon />}
                loadingPosition="start"
                component="label"
                sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
              >
                Chọn tập tin
                <input
                  hidden
                  multiple
                  accept="video/*,image/*"
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files as any)}
                />
              </LoadingButton>
            </Box>
          </Box>
          {/* upload */}
        </DialogContent>
      </Dialog>
      {/* add dialog */}

      {/* detail dialog */}
      <Dialog
        open={openDetailIndexDialog !== -1}
        onClose={handleDetailDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">Chi tiết file media</Typography>
            <Box>
              <IconButton
                onClick={() => setOpenDetailIndexDialog(openDetailIndexDialog > 0 ? openDetailIndexDialog - 1 : 0)}
                disabled={openDetailIndexDialog === 0}
              >
                <BiChevronLeftIcon fontSize="25px" />
              </IconButton>
              <IconButton
                onClick={() =>
                  setOpenDetailIndexDialog(
                    openDetailIndexDialog < medias.length - 1 ? openDetailIndexDialog + 1 : medias.length - 1,
                  )
                }
                disabled={openDetailIndexDialog === medias.length - 1}
              >
                <BiChevronRightIcon fontSize="25px" />
              </IconButton>
              <IconButton onClick={handleDetailDialogClose} color="error">
                <BiXIcon fontSize="25px" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <Box
                width="100%"
                height="100%"
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  bgcolor: theme.palette.neutral[900],
                }}
              >
                <img
                  src={openDetailIndexDialog !== -1 ? medias[openDetailIndexDialog].fileUrl : ''}
                  alt={openDetailIndexDialog !== -1 ? medias[openDetailIndexDialog].name : ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>

            <Grid item md={6}>
              <Box bgcolor={theme.palette.neutral[900]} padding="20px" borderRadius="5px">
                <InfoDetail
                  label="Đã tải lên vào lúc"
                  value={
                    openDetailIndexDialog !== -1 ? dateToString(medias[openDetailIndexDialog].createdAt as Date) : ''
                  }
                />

                <InfoDetail
                  label="Đã tải bởi"
                  value={openDetailIndexDialog !== -1 ? (medias[openDetailIndexDialog].user?.username as string) : ''}
                />

                <InfoDetail
                  label="Tên tập tin"
                  value={openDetailIndexDialog !== -1 ? (medias[openDetailIndexDialog].name as string) : ''}
                />

                <InfoDetail
                  label="Loại tập tin"
                  value={openDetailIndexDialog !== -1 ? (medias[openDetailIndexDialog].mimetype as string) : ''}
                />

                <InfoDetail
                  label="Dung lượng tệp"
                  value={openDetailIndexDialog !== -1 ? (medias[openDetailIndexDialog].size as string) : ''}
                />

                <InfoDetail
                  label="File URL"
                  value={openDetailIndexDialog !== -1 ? (medias[openDetailIndexDialog].fileUrl as string) : ''}
                />

                <Button
                  variant="outlined"
                  sx={{ marginTop: '10px' }}
                  onClick={() => handleFileUrlCopy(medias[openDetailIndexDialog].fileUrl as string)}
                >
                  Sao chép file Url
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* detail dialog */}

      {/* delete dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
          Xác nhận xóa file meida
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
            Bạn chắc chắn muốn xóa {selectedArr.length} file media này hay không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              handleDeleteDialogClose();
              handleDeleteMedia();
            }}
          >
            Xác nhận
          </Button>
          <Button variant="outlined" onClick={handleDeleteDialogClose} color="error">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      {/* delete dialog */}
    </>
  );
};

export default MediaFile;
