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
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileAdd as AiOutlineFileAddIcon } from 'react-icons/ai';
import { BiSearchAlt as BiSearchAltIcon, BiTrashAlt as BiTrashAltIcon, BiX as BiXIcon } from 'react-icons/bi';
import { BsFillCheckSquareFill as BsFillCheckSquareFillIcon } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import * as mediaApi from '../apis/mediaApi';
import { useAppDispatch } from '../app/hook';
import { Media } from '../models/Media';
import { showToast } from '../slices/toastSlice';
import { Theme } from '../theme';
import { dateToString, monthToString, toDate } from '../utils/date';
import ToastNotify from './ToastNotify';

interface Props {
  title: string;
  isOpen: boolean;
  handleClose: Function;
  handleConfirm: Function;
  multiple?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const limit = 20;
const sort = 'id';
const order = 'desc';

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const MediaDialog: React.FC<Props> = ({ title, isOpen, handleClose, handleConfirm, multiple }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();

  const [files, setFiles] = useState<File[]>([]);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [tabActive, setTabActive] = useState<number>(1);

  const [type, setType] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dates, setDates] = useState<{ label: string; value: string }[]>([]);

  const [page, setPage] = useState<number>(0);
  const [medias, setMedias] = useState<Media[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const [selectedArr, setSelectedArr] = useState<number[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [mediaDetail, setMediaDetail] = useState<Media>();

  const handleTabActiveChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabActive(newValue);
  };

  useEffect(() => {
    if (files.length > 0) {
      // upload files
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const uploadFiles = async () => {
        setIsFileLoading(true);

        try {
          const res = await mediaApi.addAny(formData);
          setIsFileLoading(false);

          dispatch(
            showToast({
              page: 'mediaDialog',
              type: 'success',
              message: res.message,
              options: { theme: 'colored', toastId: 'mediaDialogId' },
            }),
          );

          setTabActive(1);
        } catch (error: any) {
          setIsFileLoading(false);
          const { data } = error.response;
          if (data.code === 400) {
            dispatch(
              showToast({
                page: 'mediaDialog',
                type: 'error',
                message: data.message,
                options: { theme: 'colored', toastId: 'mediaDialogId' },
              }),
            );
          } else if (data.code === 401 || data.code === 403 || data.code === 500) {
            navigate(`/error/${data.code}`);
          }
        }
      };

      uploadFiles();
    }
  }, [dispatch, navigate, files]);

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files);
  };

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
      setIsMediaLoading(true);
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
        setIsMediaLoading(false);
      } catch (error: any) {
        setIsMediaLoading(false);
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

  const handleTypeFilter = (e: SelectChangeEvent) => {
    setType(e.target.value);
    setPage(0);
  };

  const handleDateFilter = (e: SelectChangeEvent) => {
    setDate(e.target.value);
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 500);
    setPage(0);
  };

  const handleMediaClick = (id: number) => {
    const selectedIndex = selectedArr.indexOf(id);

    // single file
    if (!multiple) {
      if (selectedIndex === -1) {
        const newSelectArr = [id];
        setSelectedArr([...newSelectArr]);
        const newMedia = medias.find((media) => media.id === newSelectArr[multiple ? newSelectArr.length - 1 : 0]);
        setMediaDetail(newMedia);
      } else {
        setSelectedArr([]);
      }
      return;
    }

    // multiple file
    const newSelectArr = [...selectedArr];

    if (selectedIndex === -1) {
      newSelectArr.push(id);
    } else {
      newSelectArr.splice(selectedIndex, 1);
    }

    if (newSelectArr.length > 0) {
      const newMedia = medias.find((media) => media.id === newSelectArr[multiple ? newSelectArr.length - 1 : 0]);
      setMediaDetail(newMedia);
    }

    setSelectedArr(newSelectArr);
  };

  const handleFileUrlCopy = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        dispatch(
          showToast({
            page: 'mediaDialog',
            type: 'success',
            message: 'Đã sao chép nội dung vào clipboard',
            options: { theme: 'colored', toastId: 'mediaDialogId' },
          }),
        );
      })
      .catch((_error: any) => {
        dispatch(
          showToast({
            page: 'mediaDialog',
            type: 'error',
            message: 'Lỗi khi sao chép nội dung',
            options: { theme: 'colored', toastId: 'mediaDialogId' },
          }),
        );
      });
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteMedia = async () => {
    try {
      const res = await mediaApi.removeAny(selectedArr);

      dispatch(
        showToast({
          page: 'mediaDialog',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'mediaDialogId' },
        }),
      );

      setReload(!reload);
      setSelectedArr([]);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 404) {
        dispatch(
          showToast({
            page: 'mediaDialog',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'mediaDialogId' },
          }),
        );
      } else if (data.code === 401 || data.code === 403 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleMediaDialogConfirm = () => {
    let data: string[] = [];
    for (let i = 0; i < selectedArr.length; i++) {
      const media = medias.find((media) => media.id === selectedArr[i]);
      if (media) {
        data.push(media.fileUrl);
      }
    }

    handleConfirm(multiple ? data : data[0]);
  };

  const handleMediaDialogClose = () => {
    handleClose();
    setType('');
    setDate('');
    setSearchTerm('');
  };

  return (
    <>
      <ToastNotify name="mediaDialog" />

      <Dialog
        open={isOpen}
        onClose={handleMediaDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">{title}</Typography>

            <IconButton onClick={handleMediaDialogClose} color="error">
              <BiXIcon fontSize="25px" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ width: '1200px', height: '650px' }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabActive} onChange={handleTabActiveChange} aria-label="basic tabs example">
                <Tab label="Tải file" {...a11yProps(0)} />
                <Tab label="Media" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={tabActive} index={0}>
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
                    loading={isFileLoading}
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
            </TabPanel>

            <TabPanel value={tabActive} index={1}>
              <Grid container spacing={2}>
                <Grid item md={9}>
                  <Box
                    marginBottom="20px"
                    sx={{
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
                        onChange={handleSearchChange}
                      />
                      {/* right */}
                    </Box>
                    {/* header list */}
                  </Box>

                  {/* list content */}
                  <Box display="grid" gridTemplateColumns="repeat(6,1fr)" gap="10px">
                    {medias.map((media, index) => (
                      <Box
                        key={`media-${index}`}
                        width="100%"
                        sx={{
                          border: selectedArr.includes(media.id)
                            ? `2px solid ${theme.palette.secondary[500]}`
                            : '1px solid #ccc',
                          borderRadius: '2px',
                          bgcolor: theme.palette.neutral[900],
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                        onClick={() => handleMediaClick(media.id)}
                      >
                        {isMediaLoading ? (
                          <Skeleton variant="rectangular" width="100%" sx={{ paddingBottom: '100%' }} />
                        ) : (
                          <img
                            src={media.fileUrl}
                            alt={media.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
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
                        loading={isMediaLoading}
                        loadingIndicator="Loading..."
                        component="label"
                        sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
                        onClick={() => setPage(page + 1)}
                      >
                        Xem thêm
                      </LoadingButton>
                    )}
                  </Box>

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
                </Grid>

                <Grid item md={3}>
                  {selectedArr.length > 0 && (
                    <Box bgcolor={theme.palette.neutral[900]} padding="20px" borderRadius="5px">
                      <Typography variant="h5">Chi tiết file media</Typography>
                      <Box
                        width="120px"
                        height="120px"
                        margin="15px 0"
                        sx={{
                          border: '1px solid #ccc',
                          borderRadius: '2px',
                          bgcolor: theme.palette.neutral[900],
                        }}
                      >
                        <img
                          src={mediaDetail?.fileUrl}
                          alt={mediaDetail?.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>

                      <Typography fontWeight={500}>{mediaDetail?.name}</Typography>
                      <Typography>{dateToString(mediaDetail?.createdAt)}</Typography>
                      <Typography>{mediaDetail?.mimetype}</Typography>
                      <Typography>{mediaDetail?.size}</Typography>
                      <Typography>{mediaDetail?.user?.username}</Typography>
                      <Typography>{mediaDetail?.fileUrl}</Typography>

                      <Button
                        variant="outlined"
                        sx={{ marginTop: '10px' }}
                        onClick={() => handleFileUrlCopy(mediaDetail?.fileUrl as string)}
                      >
                        Sao chép file Url
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              handleMediaDialogClose();
              handleMediaDialogConfirm();
            }}
            disabled={selectedArr.length === 0}
          >
            Xác nhận
          </Button>
          <Button variant="outlined" onClick={handleMediaDialogClose} color="error">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MediaDialog;
