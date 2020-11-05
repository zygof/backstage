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
  FormControl,
  InputLabel,
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
  options: BasicEntry[];
};

export const KindPicker = ({ control, options }: Props) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name="kind"
      defaultValue="component"
      render={({ name, value, ref, onChange }) => (
        <FormControl
          variant="outlined"
          className={classes.control}
          size="small"
        >
          <InputLabel id={`${name}-picker-label`}>Kind</InputLabel>
          <Select
            id={`${name}-picker`}
            labelId={`${name}-picker-label`}
            label="Kind"
            value={value}
            onChange={onChange}
            inputRef={ref}
          >
            {options.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};
