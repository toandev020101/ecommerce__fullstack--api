import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, useTheme } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ValueObject } from '../interfaces/ValueObject';
import { Theme } from '../theme';

interface Props {
  form: any;
  title: string;
  name: string;
  valueObjects: ValueObject[];
  row: boolean;
  required: boolean;
  [key: string]: any;
}

const RadioGroupField: React.FC<Props> = ({ form, title, name, valueObjects, row, required, ...props }) => {
  const theme: Theme = useTheme();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <FormControl>
          <FormLabel
            id={name}
            sx={{
              '&.Mui-focused': {
                color: 'rgba(0, 0, 0, 0.6)',
              },
            }}
            required
          >
            {title}
          </FormLabel>
          <RadioGroup aria-labelledby={name} name={name} value={value} row={row}>
            {valueObjects.map((valueObject, index) => (
              <FormControlLabel
                key={`radio-${index}`}
                name={name}
                label={valueObject.label}
                control={
                  <Radio
                    onBlur={onBlur} // notify when input is touched
                    onChange={onChange} // send value to hook form
                    value={valueObject.value}
                    inputRef={ref}
                    sx={{
                      color: theme.palette.primary[500],
                      '&.Mui-checked': {
                        color: theme.palette.primary[500],
                      },
                    }}
                  />
                }
                {...props}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};

export default RadioGroupField;
