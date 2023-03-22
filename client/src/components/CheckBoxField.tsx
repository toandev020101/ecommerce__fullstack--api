import { Checkbox, FormControlLabel, FormGroup, useTheme } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Theme } from '../theme';

interface Props {
  form: any;
  name: string;
  label: string;
  [key: string]: any;
}

const CheckBoxField: React.FC<Props> = ({ form, name, label, ...props }) => {
  const theme: Theme = useTheme();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
                checked={value}
                {...props}
                sx={{
                  color: theme.palette.primary[500],
                  '&.Mui-checked': {
                    color: theme.palette.primary[400],
                  },
                }}
              />
            }
            label={label}
          />
        </FormGroup>
      )}
    />
  );
};

export default CheckBoxField;
