import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export default class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    try {

      // We need a type for payload, but it will make us to 
      // change too much the structures in order to keep the domain 
      // decoupled from Users (because of the UserRole enum)
      // Lets keep it simple and use any and string check
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      this.logger.log('New request coming from ', payload);

      if (payload.role !== 'ADMIN') {
        this.checkRequestAccess(request);
      }

      request['user'] = payload;
      
      return payload != null;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private checkRequestAccess(request: Request) {
    if (request.url.includes('auth/register')) {
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request) {
    if (request.headers.authorization) {
      const [type, token] = request.headers.authorization.split(' ');
      return type === 'Bearer' ? token: undefined;
    }
  }
}