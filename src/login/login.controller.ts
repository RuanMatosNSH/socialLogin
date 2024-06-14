import {
  Headers,
  Controller,
  Request,
  Post,
  Get,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AppAuthGuard } from 'src/app-auth/app-auth.guard';
import { MicaffenioAuthGuard } from './authentication/micaffenio-auth/micaffenio-auth.guard';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login/micaffenio')
  @HttpCode(200)
  @UseGuards(MicaffenioAuthGuard)
  async postLoginMicaffenio(
    @Request() req,
    @Headers() headers: { referer: string },
  ): Promise<string> {
    return {
      ...(await this.loginService.createLoginResponse(
        headers.referer,
        req.user,
      )),
      custom: req.user.custom,
    };
  }

  @Get('idp-descriptor')
  @UseGuards(AppAuthGuard)
  getIdpDescriptor(@Query('encode') encode: string) {
    return this.loginService.getIdentityProviderDescriptor(
      encode?.toLowerCase() === 'true',
    );
  }
}
