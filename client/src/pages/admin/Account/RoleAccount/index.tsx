import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Theme } from '../../../../theme';
import { BiEdit as BiEditIcon, BiTrashAlt as BiTrashAltIcon } from 'react-icons/bi';
import { FiPlusSquare as FiPlusSquareIcon } from 'react-icons/fi';
import ToastNotify from '../../../../components/ToastNotify';
import TitlePage from '../../../../components/TitlePage';
import { Role } from '../../../../models/Role';
import * as roleApi from '../../../../apis/roleApi';
import { useAppDispatch } from '../../../../app/hook';
import { showToast } from '../../../../slices/toastSlice';

const RoleAccount: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme: Theme = useTheme();

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deleteRoleIndex, setDeleteRoleIndex] = useState<number>(-1);

  useEffect(() => {
    setIsLoading(true);
    const getAllAndUser = async () => {
      try {
        const res = await roleApi.getAllAndUser();
        setRoles(res.data as Role[]);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        const { data } = error.response;
        if (data.code === 401 || data.code === 403 || data.code === 500) {
          navigate(`/error/${data.code}`);
        }
      }
    };

    getAllAndUser();
  }, [navigate]);

  const handleDeleteRoleIndex = (index: number) => {
    setDeleteRoleIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRole = async () => {
    try {
      const res = await roleApi.removeOne(roles[deleteRoleIndex].id);

      dispatch(
        showToast({
          page: 'roleAccount',
          type: 'success',
          message: res.message,
          options: { theme: 'colored', toastId: 'roleAccountId' },
        }),
      );

      // delete role
      const newRoles = [...roles];
      newRoles.splice(deleteRoleIndex, 1);
      setRoles(newRoles);
    } catch (error: any) {
      const { data } = error.response;

      if (data.code === 403 || data.code === 404) {
        dispatch(
          showToast({
            page: 'roleAccount',
            type: 'error',
            message: data.message,
            options: { theme: 'colored', toastId: 'roleAccountId' },
          }),
        );
      } else if (data.code === 401 || data.code === 500) {
        navigate(`/error/${data.code}`);
      }
    }
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <TitlePage title="Danh sách vai trò" />
      <ToastNotify name="roleAccount" />

      <Box display="flex" justifyContent="flex-end" alignItems="flex-end" marginBottom="20px">
        <Link to="/quan-tri/tai-khoan/vai-tro/them-moi">
          <Button
            variant="contained"
            startIcon={<FiPlusSquareIcon />}
            sx={{ color: theme.palette.common.white, bgcolor: theme.palette.primary[500] }}
          >
            Thêm mới
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3}>
        {isLoading ? (
          <>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Grid item md={4} key={`role-${index}`}>
                  <Box
                    padding="20px"
                    bgcolor={theme.palette.neutral[1000]}
                    sx={{ boxShadow: 'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px', borderRadius: '5px' }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
                      <Skeleton animation="wave">
                        <Typography>Tất cả 0 người dùng</Typography>
                      </Skeleton>
                      <AvatarGroup max={4}>
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      </AvatarGroup>
                    </Box>

                    <Skeleton animation="wave">
                      <Typography variant="h4" marginBottom="10px">
                        Quản trị viên
                      </Typography>
                    </Skeleton>

                    <Box display="flex" gap="10px">
                      <Box display="inline-flex" gap="5px" color={theme.palette.warning.main}>
                        <Skeleton animation="wave">
                          <BiEditIcon fontSize="20px" />
                        </Skeleton>
                        <Skeleton animation="wave">
                          <Typography>Chỉnh sửa</Typography>
                        </Skeleton>
                      </Box>

                      <Box
                        display="inline-flex"
                        gap="5px"
                        color={theme.palette.error.main}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleDeleteRoleIndex(index)}
                      >
                        <Skeleton animation="wave">
                          <BiTrashAltIcon fontSize="20px" />
                        </Skeleton>
                        <Skeleton animation="wave">
                          <Typography>Xóa</Typography>
                        </Skeleton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
          </>
        ) : (
          <>
            {roles.map((role, index) => (
              <Grid item md={4} key={`role-${index}`}>
                <Box
                  padding="20px"
                  bgcolor={theme.palette.neutral[1000]}
                  sx={{ boxShadow: 'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px', borderRadius: '5px' }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={role.users?.length ? '10px' : '33px'}
                  >
                    <Typography color={theme.palette.neutral[400]}>Tất cả {role.users?.length} người dùng</Typography>
                    <AvatarGroup max={4}>
                      {role.users?.map((user, i) => (
                        <Avatar key={`user-${i}`} alt={user.username} src={user.avatar} />
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Typography variant="h4" marginBottom="10px">
                    {role.name}
                  </Typography>

                  <Box display="flex" gap="10px">
                    <Link to={`/quan-tri/tai-khoan/vai-tro/chinh-sua/${role.id}`}>
                      <Box display="inline-flex" gap="5px" color={theme.palette.warning.main}>
                        <BiEditIcon fontSize="20px" />
                        <Typography>Chỉnh sửa</Typography>
                      </Box>
                    </Link>

                    <Box
                      display="inline-flex"
                      gap="5px"
                      color={theme.palette.error.main}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteRoleIndex(index)}
                    >
                      <BiTrashAltIcon fontSize="20px" />
                      <Typography>Xóa</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </>
        )}
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
          Xác nhận xóa vai trò
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
            Bạn chắc chắn muốn xóa vai trò "{roles[deleteRoleIndex]?.name}" hay không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              handleDeleteDialogClose();
              handleDeleteRole();
            }}
          >
            Xác nhận
          </Button>
          <Button variant="outlined" onClick={handleDeleteDialogClose} color="error">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoleAccount;
