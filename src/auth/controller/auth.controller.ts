import { Body, Controller, Get, Post, UnauthorizedException, Req, UseGuards } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthService } from '../service/auth.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){};

    @Post('login')
    async login(@Body() { email, password }: AuthDto) {
        const userValidate = await this.authService.validateUser(email, password);

        if (!userValidate) {
            throw new UnauthorizedException('Data not valid');
        }
        
        const jwt = await this.authService.genrateJWT(userValidate);

        return jwt;
    }


    @Get('private')
    @UseGuards(AuthGuard)
    testingPrivateRoute(
        //@Req() request: Express.Request
        @GetUser() user: Usuario
    ){
        return{
            ok: true,
            message: 'Hola mundo',
            user,
        }
    }
}
