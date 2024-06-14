import { Module } from '@nestjs/common';
import { healthcheckModule } from './healthcheck/healthcheck.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [healthcheckModule, LoginModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
