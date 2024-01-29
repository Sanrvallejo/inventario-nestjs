import { SetMetadata } from '@nestjs/common'
import { ADMIN_KEY, ROLES_KEY } from 'src/constants/key-decorators';
import { Rol } from 'src/enums/rol.enum';

export const AdminAccess = () => SetMetadata( ADMIN_KEY , Rol.ADMIN );