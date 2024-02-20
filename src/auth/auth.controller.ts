import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import LoginDTO from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const token = await this.authService.signIn(loginDTO.email, loginDTO.password);
    return {
      authToken: token,
    }
  }
}
