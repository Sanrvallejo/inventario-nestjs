import { Rol } from "src/enums/rol.enum";

export interface PayloadToken {
    sub: string,
    role: Rol
}

export interface LoginBody {
    email: string,
    password: string
}

export interface AuthTokenResult {
    sub:  string;
    rol: string;
    iat:  number;
    exp:  number;
}

export interface IUseToken {
    sub:  string;
    rol: string;
    isExpired:  boolean;
}