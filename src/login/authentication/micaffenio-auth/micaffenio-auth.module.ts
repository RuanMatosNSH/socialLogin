import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MicaffenioStrategy } from './micaffenio-auth.strategy';
import { ConfigModule } from '@nestjs/config';
import { MicaffenioAuthGuard } from './micaffenio-auth.guard';
import { MicaffenioAuthService } from './micaffenio-auth.service';
import { HttpModule } from '@nestjs/axios';
import configuration from './configuration';
import { HttpConfigService } from './http-config.service';

@Module({
  imports: [
    PassportModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useClass: HttpConfigService,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [MicaffenioStrategy, MicaffenioAuthGuard, MicaffenioAuthService],
})
export class MicaffenioAuthModule {}
