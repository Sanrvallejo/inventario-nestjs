import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
  } from '@nestjs/common';
  
  export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.idUser;
  
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return data ? user[data] : user;
  });