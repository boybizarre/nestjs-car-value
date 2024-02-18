import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

// interceptor runs before the CurrentUser decorator
// it places the user on the request
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userID } = request.session || {};

    if (userID) {
      const user = await this.usersService.findOne(userID);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
