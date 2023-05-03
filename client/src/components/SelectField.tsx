import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { FieldError } from '../interfaces/FieldError';
import { ValueObject } from '../interfaces/ValueObject';

interface Props {
  form: any;
  errorServers: FieldError[];
  setErrorServers: Function;
  label: string;
  name: string;
  valueObjects: ValueObject[];
  maxWidth?: string;
  onHandleChange?: Function;
  required?: boolean;
  [key: string]: any;
}

const SelectField: React.FC<Props> = ({
  form,
  errorServers,
  setErrorServers,
  label,
  name,
  valueObjects,
  maxWidth,
  onHandleChange,
  required,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, error: errorClient } }) => (
        <FormControl
          fullWidth
          error={invalid || !!errorServers.find((error) => error.field === name)}
          sx={{
            maxWidth,
          }}
        >
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
            onChange={(e) => {
              // delete error on change
              const newErrorServers = errorServers;
              const newErrorServerIndex = newErrorServers.findIndex((error) => error.field === name);
              newErrorServers.splice(newErrorServerIndex, 1);
              setErrorServers(newErrorServers);

              onChange(e);
              if (onHandleChange) {
                onHandleChange(e);
              }
              setSearchTerm('');
            }} // send value to hook form
            onBlur={onBlur}
            ref={ref}
            {...props}
          >
            {valueObjects
              .filter((valueObject) => valueObject.label.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((valueObject, index) => (
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
