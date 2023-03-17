import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FieldError } from '../interfaces/FieldError';
import { ValueObject } from '../interfaces/ValueObject';

interface Props {
  form: any;
  errorServers: FieldError[];
  label: string;
  name: string;
  valueObjects: ValueObject[];
  required: boolean;
  [key: string]: any;
}

const SelectField: React.FC<Props> = ({ form, errorServers, label, name, valueObjects, required, ...props }) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, error: errorClient } }) => (
        <FormControl fullWidth error={invalid || !!errorServers.find((error) => error.field === name)}>
          <InputLabel id={`demo-simple-select-${label}`}>
            {label}
            {required ? ' *' : ''}
          </InputLabel>
          <Select
            labelId={`demo-simple-select-${label}`}
            id={`demo-simple-${label}`}
            value={value}
            label={label}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            {...props}
          >
            {valueObjects.map((valueObject, index) => (
              <MenuItem key={`select-${index}`} value={valueObject.value}>
                {valueObject.label}
              </MenuItem>
            ))}
          </Select>
          {(invalid || !!errorServers.find((error) => error.field === name)) && (
            <FormHelperText sx={{ fontSize: '14px' }}>
              {errorClient?.message || errorServers.find((error) => error.field === name)?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectField;
