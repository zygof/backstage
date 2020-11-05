/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { BasicEntry } from '../types';

const useStyles = makeStyles({
  control: {
    width: '100%',
  },
});

type Props = {
  control: Control;
  options?: BasicEntry[] | undefined;
};

function renderValue(selectedUnknown: unknown, options: BasicEntry[]) {
  const selected: string[] = selectedUnknown as string[];

  if (!selected.length) {
    return '';
  }

  return selected
    .map(id => options.find(option => option.id === id)?.label || id)
    .join(', ');
}

export const TypePicker = ({ control, options }: Props) => {
  const classes = useStyles();

  if (!options?.length) {
    return null;
  }

  return (
    <Controller
      control={control}
      name="type"
      defaultValue={[]}
      render={({ name, value, ref, onChange }) => (
        <FormControl
          variant="outlined"
          className={classes.control}
          size="small"
        >
          <InputLabel id={`${name}-picker-label`}>Type</InputLabel>
          <Select
            id={`${name}-picker`}
            labelId={`${name}-picker-label`}
            label="Type"
            multiple
            value={value}
            renderValue={selected => <>{renderValue(selected, options)}</>}
            onChange={onChange}
            inputRef={ref}
          >
            {options.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
                <Checkbox size="small" checked={value && value.includes(id)} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
