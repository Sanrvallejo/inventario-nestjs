import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { Reflector } from '@nestjs/core';
  import { Request } from 'express';
  import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorators';
  import { Rol } from 'src/enums/rol.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector, //Permite leer atributos de decoradores
    ) {}
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );
  
      if (isPublic) {
        return true;
      }
  
      const roles = this.reflector.get<Array<keyof typeof Rol>>(
        ROLES_KEY,
        context.getHandler(),
      );
  
      const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());
  
      const req = context.switchToHttp().getRequest<Request>();
      const { rolUser } = req;
  
      if (roles === undefined) {
        if (!admin) {
          return true;
        } else if (admin && rolUser === admin) {
          return true;
        } else {
          throw new UnauthorizedException('Not allowed');
        }
      }
  
      if (rolUser === Rol.ADMIN) {
        return true;
      }
  
      const isAuth = roles.some((role) => role === rolUser);
  
      if (!isAuth) {
        throw new UnauthorizedException('Not allowed');
      }
      return true;
    }
  }