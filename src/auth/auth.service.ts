import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../repository/repository.types';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(clientId: string, password: string): Promise<string> {
    const foundUser = this.userService.findByClientIdAndPassword(clientId, password);

    if (foundUser) {
      return this.jwtService.signAsync({
        clientId: foundUser.id,
        role: foundUser.role.toString(),
      });
    } else {
      throw new UnauthorizedException();
    }
  }

  async create(clientId: string, password: string, description: string) {
    this.userService.create({
      clientId,
      password,
      description,
      role: UserRole.DEFAULT
    });
  }
}
