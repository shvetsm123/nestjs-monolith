import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Database error';
    let statusCode = 500;

    if (exception.code === 'P2002') {
      message = `Unique constraint failed on fields: ${exception.meta?.target}`;
      statusCode = 400;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Bad Request',
    });
  }
}
