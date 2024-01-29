import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PayloadToken } from '../interfaces/auth.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JWT_SECRET } from 'src/constants/constants';
import { Usuario } from 'src/usuario/entities/usuario.entity';


ConfigModule.forRoot({
    envFilePath: '.development.env',
});

const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UsuarioService) {}
  /**este método es el que compara el email mandado por el body con la contraeña
   para hacer el match */
  async validateUser(email: string, password: string) {
    /**
     * A este método se le pasa un objeto: { key, value } para construir
     * una queryBuilder dinámica en el servicio de usuario con el fin de
     * no especificar el atributo (key) ni su valor (value)
     */
    const userByEmail = await this.usuarioService.findBy({
      key: 'email',
      value: email,
    });

    if (userByEmail) {
      /**
       * Específicamente el metodo compare de bcrypt es el encargado de hacer la validadcion.
       * Se le pasa la contraseña que se manda desde el body y la contraseña del usuario
       * encontrado en el método anterior. compare(password, entidad.password)
       * */
      const match = await bcrypt.compare(password, userByEmail.password);
      console.log(userByEmail);
      
      if (match) return userByEmail;
    }
    console.log(userByEmail);
    
    return null;
  }

  signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: string | number;
  }) {
    
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  async genrateJWT(user: Usuario): Promise<any> {
    const getUser = await this.usuarioService.findUserById(user.id);
    
    const payload: PayloadToken = {
        sub: getUser.id, //se convierte a string porque el sub de JwtPayload es de tipo string.
        role: getUser.rol,
    }
    
    return {
        accessToken: this.signJWT({
            payload,
            secret: configService.get<string>(JWT_SECRET),
            expires: '1h',
        }),
        user
    }
  }
}