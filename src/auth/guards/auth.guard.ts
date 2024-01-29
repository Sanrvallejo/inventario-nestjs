import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PUBLIC_KEY } from 'src/constants/key-decorators';
  import { Request } from 'express';
  import { useToken } from 'src/utils/use.token';
  import { IUseToken } from '../interfaces/auth.interface';
  import { UsuarioService } from './../../usuario/usuario.service';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly usuarioService: UsuarioService,
      private readonly reflector: Reflector, //Permite leer atributos de decoradores
    ) {}
    async canActivate(context: ExecutionContext) {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );
  
      if (isPublic) {
        return true;
      }
  
      const req = context.switchToHttp().getRequest<Request>();
  
      const token = req.headers['token_petifruv'];
  
      if (!token || Array.isArray(token)) {
        throw new UnauthorizedException('Invalid token');
      }
  
      const manageToken: IUseToken | string = useToken(token);
      if (typeof manageToken === 'string') {
        throw new UnauthorizedException(manageToken);
      }
  
      if(manageToken.isExpired){
        throw new UnauthorizedException('Token expired');
      }
  
      const { sub } = manageToken;
      const user = await this.usuarioService.findUserById(sub);
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }
  
      req.idUser = user.id;
      req.rolUser = user.rol;
      return true;
    }
  }