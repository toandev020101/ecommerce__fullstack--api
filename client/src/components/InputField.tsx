import { Box, IconButton, TextField, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { BiHide as BiHideIcon, BiShowAlt as BiShowAltIcon } from 'react-icons/bi';
import { FieldError } from '../interfaces/FieldError';
import { Theme } from '../theme';

interface Props {
  form: any;
  name: string;
  errorServers: FieldError[];
  [key: string]: any;
}

const InputField: React.FC<Props> = ({ form, name, errorServers, ...props }) => {
  const theme: Theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const type = props.type;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, error: errorClient } }) => (
        <Box position="relative">
          <TextField
            onBlur={onBlur} // notify when input is touched
            onChange={(e) => {
              onChange(e);
              errorServers = [];
            }} // send value to hook form
            value={value}
            inputRef={ref}
            name={name}
            {...props}
            error={invalid || !!errorServers.find((error) => error.field === name)}
            helperText={
              errorClient?.message || errorServers[errorServers.findIndex((error) => error.field === name)]?.message
            }
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            fullWidth
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

              '& fieldset, & label.Mui-error, & label': {
                fontSize: '16px',
              },

              '& input': {
                paddingRight: type === 'password' ? '50px' : '0',
              },

              '& p': {
                fontSize: '14px',
              },

              marginBottom: '10px',
            }}
          />

          {type === 'password' && (
            <IconButton
              aria-label="showPassword"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              sx={{ position: 'absolute', top: '13%', right: '20px' }}
            >
              {showPassword ? <BiHideIcon /> : <BiShowAltIcon />}
            </IconButton>
          )}
        </Box>
      )}
    />
  );
};

export default InputField;
