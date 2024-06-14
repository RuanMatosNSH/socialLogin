import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from './authorization/authorization.service';
import { LoginRequest } from './authorization/identity-provider-occ/login';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);
  constructor(private readonly authorization: AuthorizationService) {}

  public async createLoginResponse(referer: string, user: LoginRequest) {
    try {
      return await this.authorization.createLoginResponse(referer, user);
    } catch (ex) {
      this.logger.log('LoginService - error - ' + user.email + ' - ' + ex);
      throw new UnauthorizedException();
    }
  }

  public getIdentityProviderDescriptor(encode: boolean) {
    return this.authorization.getIdentityProviderDescriptor(encode);
  }
}
