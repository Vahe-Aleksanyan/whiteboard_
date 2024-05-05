import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@nestjs/swagger';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(
    private entityClass,
    private classTransformOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let obj = data;

        if (data?.toJSON) {
          obj = data?.toJSON();
        }
        if (data?.lean) {
          obj = data?.lean();
        }
        return plainToInstance(
          this.entityClass,
          obj,
          this.classTransformOptions,
        );
      }),
    );
  }
}

export function Lean(
  Class,
  isArray?: boolean,
  classTransformOptions?: ClassTransformOptions,
) {
  return applyDecorators(
    UseInterceptors(new TransformInterceptor(Class, classTransformOptions)),
    ApiResponse({ type: Class, isArray }),
  );
}
