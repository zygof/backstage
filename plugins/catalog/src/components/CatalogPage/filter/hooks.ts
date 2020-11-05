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

import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../../plugin';
import { FormValues } from '../types';
import {
  getDefaultFormValues,
  getFilteredEntities,
  getInitialFormValuesFromEnvironment,
  getSearchParamsFromFormValues,
} from './core';
import { filters } from './filters';

/**
 * Decodes the location search parameters once on page mount, and supplies the
 * initial form settings based on that.
 */
export function useInitialFormValuesFromEnvironment(): Partial<FormValues> {
  return useMemo(
    () => getInitialFormValuesFromEnvironment(filters, window.location.search),
    [],
  );
}

/**
 * Gets all of the form default values.
 */
export function useDefaultFormValues(): FormValues {
  return useMemo(() => getDefaultFormValues(filters), []);
}

/**
 * Creates a setter function, that updates the location query parameters based
 * on the current form values.
 *
 * @param formValues The current form values
 */
export function useUpdateFormValuesToEnvironment(formValues: FormValues): void {
  const navigate = useNavigate();
  const params = getSearchParamsFromFormValues(filters, formValues);
  const paramsString = params.toString();

  useEffect(() => {
    try {
      navigate(`.?${paramsString}`, { replace: true });
    } catch {
      // Ignore
    }
  }, [navigate, paramsString]);
}

/**
 * Takes the current form values, and returns the entities.
 *
 * @param formValues The current form values
 */
export function useFilteredEntities(
  formValues: FormValues,
): AsyncState<Entity[]> {
  const catalogApi = useApi(catalogApiRef);

  const [state, run] = useAsyncFn(
    () => getFilteredEntities(filters, catalogApi, formValues),
    [formValues, catalogApi],
  );

  useEffect(() => {
    run();
  }, [JSON.stringify(formValues)]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
