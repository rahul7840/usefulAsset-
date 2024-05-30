import InternalRequestException from '@common/exceptions/internal.request.exception';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ExternalNetworkGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const header =
      request.headers['X-Envoy-External-Address'] ??
      request.headers['x-envoy-external-address'];

    if (header) {
      throw new InternalRequestException(HttpStatus.FORBIDDEN, null);
    }
    return true;
  }
}
