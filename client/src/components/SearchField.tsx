import { Autocomplete, Box, TextField, useTheme } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { BiSearchAlt as BiSearchAltIcon } from 'react-icons/bi';
import { ValueObject } from '../interfaces/ValueObject';
import { Theme } from '../theme';

interface Props {
  form: any;
  name: string;
  label: string;
  options?: ValueObject[];
  searchValues?: ValueObject[];
  onHandleChange: Function;
  onHandleMultipleChange?: Function;
  keyNumber?: number;
}

const SearchField: React.FC<Props> = ({
  form,
  options,
  searchValues,
  name,
  label,
  onHandleChange,
  onHandleMultipleChange,
  keyNumber = 3,
}) => {
  const theme: Theme = useTheme();
  const [optionValues, setOptionValues] = useState<ValueObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (searchValues) {
      setOptionValues(searchValues);
      form.setValue(name, searchValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  return (
    <Box position="relative">
      <Autocomplete
        multiple
        disableClearable
        id="tags-outlined"
        options={options ? options : []}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length >= keyNumber) {
                onHandleChange(e);
              }
              setSearchTerm(e.target.value);
            }}
          />
        )}
        popupIcon=""
        noOptionsText={searchTerm.length < keyNumber ? `Vui lòng nhập ${keyNumber} hoặc nhiều ký tự` : 'Không tìm thấy'}
        sx={{ marginBottom: '10px' }}
        isOptionEqualToValue={(option, value) => option.label.toLowerCase() === value.label.toLowerCase()}
        value={optionValues}
        onChange={(_e: any, options: ValueObject[]) => {
          setOptionValues(options);
          if (onHandleMultipleChange) {
            form.setValue(name, options);
            onHandleMultipleChange();
          } else {
            const values = options.map((option) => option.value);
            form.setValue(name, values);
          }
        }}
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
