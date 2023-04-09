import { FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { Controller } from 'react-hook-form';
import { BiSearchAlt as BiSearchAltIcon } from 'react-icons/bi';
import { FieldError } from '../interfaces/FieldError';
import { ValueObject } from '../interfaces/ValueObject';

interface Props {
  form: any;
  errorServers: FieldError[];
  label: string;
  name: string;
  valueObjects: ValueObject[];
  maxWidth?: string;
  onHandleChange?: Function;
  required?: boolean;
  search?: boolean;
  [key: string]: any;
}

const SelectField: React.FC<Props> = ({
  form,
  errorServers,
  label,
  name,
  valueObjects,
  maxWidth,
  onHandleChange,
  required,
  search,
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
              onChange(e);
              if (onHandleChange) {
                onHandleChange(e);
              }
              errorServers = [];
              setSearchTerm('');
            }} // send value to hook form
            onBlur={onBlur}
            ref={ref}
            {...props}
          >
            {search && (
              <TextField
                id="outlined-basic"
                label="Tìm kiếm ..."
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BiSearchAltIcon fontSize="20px" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  padding: '0 15px 10px',
                  '& label': {
                    paddingLeft: '15px',
                  },
                }}
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onClick={(e: any) => e.stopPropagation()}
              />
            )}
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
