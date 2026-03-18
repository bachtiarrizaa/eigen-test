import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_METADATA } from '../decorators/response-message.decorator';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) ?? 'Operation successful';

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message,
        data,
      })),
    );
  }
}
