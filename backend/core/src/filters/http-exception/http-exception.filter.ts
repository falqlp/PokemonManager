import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import { NotificationType } from '../../websocket/WebsocketDataService';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly websocketUtils: WebsocketUtils) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext: HttpArgumentsHost = host.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Récupérer le Game ID depuis les headers de requête
    const gameId = request.headers['game-id'] as string;

    // Envoyer une notification via WebSocket en cas d'erreur interne
    this.websocketUtils.notify(
      'INTERNAL_ERROR',
      NotificationType.Error,
      gameId,
    );
    Logger.error(exception);

    // Renvoyer une réponse JSON abstraite
    response.status(status).json({
      statusCode: status,
      message: (exception as Error).message,
      path: request.url,
    });
  }
}
