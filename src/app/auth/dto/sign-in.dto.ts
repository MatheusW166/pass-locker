import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { PickType } from '@nestjs/mapped-types';

export class SignInDto extends PickType(CreateUserDto, ['email', 'password']) {}
