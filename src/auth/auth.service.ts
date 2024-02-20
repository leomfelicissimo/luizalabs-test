import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<string> {
    const foundUser = this.userService.findByEmailAndPassword(email, password);

    if (foundUser) {
      return this.jwtService.signAsync({
        userId: foundUser.id,
        userEmail: foundUser.email,
        role: foundUser.role
      });
    } else {
      throw new UnauthorizedException();
    }
  }
}
