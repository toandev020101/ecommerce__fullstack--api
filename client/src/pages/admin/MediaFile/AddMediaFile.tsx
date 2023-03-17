import { Box, Breadcrumbs, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TitlePage from '../../../components/TitlePage';
import ToastNotify from '../../../components/ToastNotify';
import { Theme } from '../../../theme';
import * as mediaApi from '../../../apis/mediaApi';
import { LoadingButton } from '@mui/lab';
import { AiOutlineFileAdd as AiOutlineFileAddIcon } from 'react-icons/ai';
import { useAppDispatch } from '../../../app/hook';
import { showToast } from '../../../slices/toastSlice';

const AddMediaFile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (files.length > 0) {
      // upload files
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const uploadFiles = async () => {
        setIsLoading(true);

        try {
          const res = await mediaApi.addAny(formData);
          setIsLoading(false);

          dispatch(
            showToast({
              page: 'mediaFile',
              type: 'success',
              message: res.message,
              options: { theme: 'colored', toastId: 'mediaFileId' },
            }),
          );
          navigate('/quan-tri/kho-luu-tru');
        } catch (error: any) {
          setIsLoading(false);
          const { data } = error.response;
          if (data.code === 400) {
            dispatch(
              showToast({
                page: 'addMediaFile',
                type: 'error',
                message: data.message,
                options: { theme: 'colored', toastId: 'addMediaId' },
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

  return (
    <>
      <TitlePage title="Thêm mới hình ảnh, video" />
      <ToastNotify name="addMedia" />
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link to="/quan-tri/kho-luu-tru">Kho lưu trữ</Link>
        <Typography color="text.primary">Thêm mới</Typography>
      </Breadcrumbs>

      {/* upload */}
      <Box display="flex" justifyContent="center" alignItems="center" color={theme.palette.neutral[300]}>
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
    </>
  );
};

export default AddMediaFile;
