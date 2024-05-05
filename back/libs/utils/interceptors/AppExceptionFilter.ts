import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      !exception.status || typeof exception.status === 'string'
        ? 400
        : exception.status;

    if (exception && exception instanceof MongoError) {
      switch (exception.code) {
        case 11000:
          response.status(status).send(exception);
          break;
        default:
          response.status(status).send(exception);
          break;
      }
    } else {
      switch (exception.name) {
        case 'DocumentNotFoundError':
          response.status(404).send(exception);
          break;

        case 'ValidationError':
          const key = Object.keys(exception.errors).pop();

          response
            .status(status)
            .send(key ? exception.errors[key] : exception.errors);
          break;
        case 'BadRequestException':
          //         response: {
          //   statusCode: 400,
          //   message: [
          //     'Минимум 1 вопрос для собесодования',
          //     'Минимум 1 вопрос для теста'
          //   ],
          //   error: 'Bad Request'
          // },
          // status: 400

          // TODO: temp fix
          if (
            exception?.response?.message?.some((x) =>
              x.includes('type must be a valid enum value'),
            )
          ) {
            return response.status(200).send();
          }

          response.status(status).send(exception.response);
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore

          response
            .status(status)
            .send(exception.errors || exception.response || exception);
          break;
      }
    }
  }
}
