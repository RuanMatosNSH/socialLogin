import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: this.configService.get('httpModule.timeout'),
      maxRedirects: this.configService.get('httpModule.maxRedirects'),
      baseURL: this.configService.get('httpModule.baseUrl'),
      auth: {
        username: this.configService.get('httpModule.username'),
        password: this.configService.get('httpModule.password'),
      },
    };
  }
}
