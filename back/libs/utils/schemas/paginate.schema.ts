import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { Allow } from 'class-validator';
import { Document, Model, PaginateOptions } from 'mongoose';

export class PaginateResult<T> {
  @ApiProperty({ isArray: true })
  docs: T[];

  @ApiProperty()
  @Expose()
  totalDocs: number;
  @ApiProperty()
  @Expose()
  limit: number;
  @ApiProperty()
  @Expose()
  totalPages: number;
  @ApiProperty()
  @Expose()
  page: number;
}

export class PaginateQuery {
  @Allow()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ default: 1, required: false, type: Number })
  page = 1;

  @Allow()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ default: 10, required: false, type: Number })
  limit = 10;

  @ApiProperty({ default: '_id', required: false, type: String })
  sortField? = '_id';

  @ApiProperty({ default: '', required: false, type: String })
  @Allow()
  @Transform(({ value }) => value?.trim())
  searchText? = '';

  @ApiProperty({
    default: '1',
    required: false,
    enum: ['1', '-1'],
    nullable: false,
    type: String,
  })
  sortValue? = '-1';

  @Allow()
  @Expose()
  @Transform(({ obj: { sortField, sortValue } }) => {
    const sort = { [String(sortField || '_id')]: Number(sortValue ?? -1) };
    return sort;
  })
  sort?: string;

  [key: string]: any;
}

export const ApiPaginated = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginateResult) },
          {
            properties: {
              docs: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
    // ApiQuery({ type: query }),
  );
};

// //[key in keyof TQ
export { PaginateModel } from 'mongoose';
