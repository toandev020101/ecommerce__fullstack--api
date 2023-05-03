import { Autocomplete, Box, TextField, useTheme } from '@mui/material';
import React, { ChangeEvent, useState, useEffect } from 'react';
import { BiSearchAlt as BiSearchAltIcon } from 'react-icons/bi';
import { ValueObject } from '../interfaces/ValueObject';
import { Theme } from '../theme';

interface Props {
  form: any;
  name: string;
  label: string;
  options?: ValueObject[];
  searchValue?: ValueObject;
  onHandleChange: Function;
  onHandleOptionChange?: Function;
  required?: boolean;
  disabled?: boolean;
}

const SearchField: React.FC<Props> = ({
  form,
  options,
  searchValue,
  name,
  label,
  onHandleChange,
  onHandleOptionChange,
  required = false,
  disabled = false,
}) => {
  const theme: Theme = useTheme();
  const [searchOption, setSearchOption] = useState<ValueObject>({ label: '', value: -1 });

  useEffect(() => {
    if (searchValue && searchValue.label) {
      setSearchOption(searchValue);
      form.setValue(name, searchValue.value);
    } else {
      setSearchOption({ label: '', value: -1 });
      form.setValue(name, '');
    }
  }, [searchValue, form, name]);

  return (
    <Box position="relative" width="100%">
      <Autocomplete
        disableClearable
        id="tags-outlined"
        options={options ? options : []}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={label}
            required={required}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onHandleChange(e);
              setSearchOption({ label: e.target.value, value: -1 });

              const value = options?.find((option) => option.label === e.target.value)?.value;
              if (value) {
                form.setValue(name, value);
              } else {
                form.setValue(name, '');
              }
            }}
          />
        )}
        popupIcon=""
        noOptionsText="Không tìm thấy"
        sx={{ marginBottom: '10px' }}
        value={searchOption}
        onChange={(_e: any, option: ValueObject | null) => {
          if (option) {
            setSearchOption(option);
            form.setValue(name, option.value);
            if (onHandleOptionChange) {
              onHandleOptionChange(option);
            }
          }
        }}
        disabled={disabled}
      />

      <BiSearchAltIcon
        fontSize="20px"
        style={{
          position: 'absolute',
          top: '16px',
          right: '10px',
          color: theme.palette.neutral[400],
        }}
      />
    </Box>
  );
};

export default SearchField;
