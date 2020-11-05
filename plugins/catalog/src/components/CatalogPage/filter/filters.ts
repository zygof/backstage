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

import { FilterSpec } from '../types';

export const filters: FilterSpec[] = [
  {
    name: 'kind',
    type: 'select',
    defaultValue: 'component',
    options(formValues, entities) {
      return [];
    },
    outputs(value, output) {
      output.addServerFilter('kind', value);
    },
  },

  {
    name: 'type',
    type: 'multiselect',
    options(formValues, entities) {
      return [];
    },
    outputs(values, output) {
      for (const value of values) {
        output.addServerFilter('spec.type', value);
      }
    },
  },
];
