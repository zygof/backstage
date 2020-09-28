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

import { ApiEntity, Entity, LocationSpec } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/config';
import yaml from 'yaml';
import {
  LocationProcessor,
  LocationProcessorEmit,
  LocationProcessorRead,
  LocationProcessorResult,
} from './types';
import path from 'path';

import * as results from './results';

/**
 * Handles API entities that reference an actual schema, and imports as much as
 * possible from that schema into the entity definition, for fields that are
 * not specified manually.
 */
export class ApiSchemaImportProcessor implements LocationProcessor {
  async processEntity(
    rawEntity: Entity,
    location: LocationSpec,
    emit: LocationProcessorEmit,
    read: LocationProcessorRead,
  ): Promise<Entity> {
    const source = rawEntity.metadata.annotations?.['backstage.io/source'];
    if (rawEntity.kind !== 'API' || !source) {
      return rawEntity;
    }

    // Build the URL to the daw data and fetch it
    const entity = rawEntity as ApiEntity;
    let url: URL;
    let data: string;
    try {
      url = new URL(source, location.target);
      const rawData = await read({
        type: location.type,
        target: url.toString(),
      });
      data = rawData.toString('utf-8');
    } catch (e) {
      emit(
        results.generalError(
          location,
          `Unable to read referenced API schema at ${source}, ${e}`,
        ),
      );
      return entity;
    }

    try {
      const { name, description, type } = extractFields(entity, url);
      if (name) {
        entity.metadata.name = name;
      }
      if (description) {
        entity.metadata.description = description;
      }
      if (type) {
        entity.spec.type = type;
      }
    } catch (e) {
      emit(
        results.generalError(
          location,
          `Unable to inject API schema information from ${url.toString()}, ${e}`,
        ),
      );
      return entity;
    }
  }
}

function extractFields(
  entity: ApiEntity,
  url: URL,
): {
  name?: string;
  description?: string;
  type?: string;
} {
  const filename = decodeURIComponent(
    path.basename(url.pathname),
  ).toLowerCase();
  const dotParts = filename.split('.');
  const extension = dotParts.length >= 2 ? dotParts[dotParts.length - 1] : '';

  let type = entity.spec.type;
  if (!type) {
    switch (extension.toLowerCase()) {
      case 'graphql':
      case 'graphqls':
        type = 'graphql';
        break;
      case 'openapi':
      case 'swagger':
        type = 'openapi';
        break;
      default:
        break;
    }
  }

  throw new Error('Unable to parse extension, or unknown extension');
}
