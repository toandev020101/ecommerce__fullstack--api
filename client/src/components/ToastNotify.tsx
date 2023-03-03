import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { closeToast, selectToast } from '../slices/toastSlice';

interface Props {
  name: string;
}

const ToastNotify: React.FC<Props> = ({ name }) => {
  const dispatch = useAppDispatch();
  const { page, type, message, options } = useAppSelector(selectToast);

  useEffect(() => {
    if (page === name && message) {
      toast[type](message, options);
      dispatch(closeToast());
    }
  }, [dispatch, message, name, options, page, type]);

  return <ToastContainer />;
};

export default ToastNotify;
