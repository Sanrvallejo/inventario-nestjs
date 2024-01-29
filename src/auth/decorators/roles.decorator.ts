import { SetMetadata } from '@nestjs/common'
import { ROLES_KEY } from 'src/constants/key-decorators';
import { Rol } from 'src/enums/rol.enum';

export const Roles = (...roles: Array<keyof typeof Rol>) => SetMetadata(ROLES_KEY , roles);