import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppAuthModule } from 'src/app-auth/app-auth.module';
import { MicaffenioAuthModule } from './authentication/micaffenio-auth/micaffenio-auth.module';
import { AuthorizationService } from './authorization/authorization.service';
import configuration from './configuration';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AppAuthModule,
    MicaffenioAuthModule,
  ],
  controllers: [LoginController],
  providers: [AuthorizationService, LoginService],
})
export class LoginModule {}
