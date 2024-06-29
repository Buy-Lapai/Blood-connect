import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import logger from 'src/utils/logger.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;

    let context: any;
    try {
      context = host.switchToHttp();
    } catch (error) {
      console.log(error);
    }

    const req = context?.getRequest();
    const res = context?.getResponse();

    const ipAddress =
      req?.ip || req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress;

    const httpStatusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(httpStatusCode, 'status');

    let responseData: any = exception?.message || 'Internal Server Error'; // Default message

    if (exception instanceof Error) {
      responseData = exception.message;
    } else if (typeof exception === 'string') {
      responseData = exception;
    }

    if (!responseData?.message) {
      responseData = { message: responseData };
    }

    let responseDataAsString = JSON.stringify(responseData);

    logger(module).info(
      `${httpStatusCode} - ${req?.method} - ${ipAddress}- ${req?.originalUrl} - ${
        httpStatusCode >= 400 ? responseDataAsString : 'success'
      }`,
    );

    res?.setHeader('Cache-control', 'no-cache');
    res?.setHeader('Pragma', 'no-store');
    res?.setHeader('X-XSS-Protection', '1; mode=block');

    const responseBody = {
      data: responseData,
      status: httpStatusCode < 400 ? 'success' : 'error',
    };

    // Handle context potentially being unavailable
    if (httpStatusCode === 401) {
      httpAdapter.reply(context?.getResponse(), responseBody, httpStatusCode);
    } else {
      console.log(exception);
      logger(module).error(
        'Failed to send response due to unavailable context',
      );
    }
  }
}
