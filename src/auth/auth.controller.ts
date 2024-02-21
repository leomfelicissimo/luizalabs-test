import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import LoginDTO from './dto/login.dto';
import RegisterDTO from './dto/register.dto';
import AuthGuard from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDTO: LoginDTO) {
    const token = await this.authService.signIn(loginDTO.clientId, loginDTO.password);
    return {
      authToken: token,
    }
  }

  @UseGuards(AuthGuard)
  @Post('register')
  async create(@Body() registerDTO: RegisterDTO) {
    return this.authService.create(
      registerDTO.clientId,
      registerDTO.password,
      registerDTO.description
    );
  }
}
