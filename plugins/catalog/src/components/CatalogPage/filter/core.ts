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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { FilterOutput, FilterSpec, FormValues } from '../types';

/**
 * Given the filter specs and a URL search string, return all of the form
 * values that the environment had specified.
 *
 * @param filters All of the filter specs
 * @param search A URL search string
 */
export function getInitialFormValuesFromEnvironment(
  filters: FilterSpec[],
  search: string,
): Partial<FormValues> {
  const params = new URLSearchParams(search.replace(/^[?]/, ''));

  const result: any = {};

  for (const filter of filters) {
    const envValues = params.getAll(`filter.${filter.name}`).filter(Boolean);

    if (!envValues.length) {
      if (filter.defaultValue) {
        result[filter.name] = filter.defaultValue;
      }
    } else {
      switch (filter.type) {
        case 'select':
          result[filter.name] = envValues[0];
          break;
        case 'multiselect':
          result[filter.name] = envValues;
          break;
        default:
          throw new Error(`Unknown filter type`);
      }
    }
  }

  return result;
}

/**
 * Given the filter specs, return all of the form default values.
 *
 * @param filters All of the filter specs
 */
export function getDefaultFormValues(filters: FilterSpec[]): FormValues {
  const result: any = {};

  for (const filter of filters) {
    switch (filter.type) {
      case 'select':
        result[filter.name] = filter.defaultValue ?? '';
        break;
      case 'multiselect':
        result[filter.name] = filter.defaultValue ?? [];
        break;
      default:
        throw new Error(`Unknown filter type`);
    }
  }

  return result;
}

/**
 * Given the filter specs and the current form values, return search params
 * corresponding to its actual set values.
 *
 * @param filters All of the filter specs
 * @param formValues The current actual values of the form
 */
export function getSearchParamsFromFormValues(
  filters: FilterSpec[],
  formValues: FormValues,
): URLSearchParams {
  const result = new URLSearchParams();

  for (const filter of filters) {
    const value = (formValues as any)[filter.name];
    if (value && value?.length !== 0) {
      for (const v of [value].flat()) {
        result.append(`filter.${filter.name}`, v.toLowerCase());
      }
    }
  }

  result.sort();

  return result;
}

export function getFiltersOptions(
  filters: FilterSpec[],
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const filter of filters) {
  }

  return result;
}

/**
 * Given the filter specs and form values, fetches all matching entities from the API.
 *
 * @param catalogApi The catalog API implementation
 * @param formValues The current actual values of the form
 */
export async function getFilteredEntities(
  filters: FilterSpec[],
  catalogApi: CatalogApi,
  formValues: FormValues,
): Promise<Entity[]> {
  const serverFilter: Record<string, string[]> = {};
  const clientFilters: ((entity: Entity) => boolean)[] = [];
  const output: FilterOutput = {
    addServerFilter(key, value) {
      const values =
        key in serverFilter ? serverFilter[key] : (serverFilter[key] = []);
      values.push(value);
    },
    addClientFilter(filter: (entity: Entity) => boolean) {
      clientFilters.push(filter);
    },
  };

  for (const filter of filters) {
    const value: any = (formValues as any)[filter.name];
    switch (filter.type) {
      case 'select':
        if (value && typeof value === 'string') {
          filter.outputs(value, output);
        }
        break;
      case 'multiselect':
        if (
          value &&
          Array.isArray(value) &&
          value.every(v => typeof v === 'string')
        ) {
          filter.outputs(value, output);
        }
        break;
      default:
        throw new Error(`Unknown filter type`);
    }
  }

  const serverFiltered = await catalogApi.getEntities(serverFilter);
  return serverFiltered.filter(entity => clientFilters.every(f => f(entity)));
}
