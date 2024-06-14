import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

  @Get('healthcheck')
  getHello(): any {
    this.logger.log('healthcheck - ok');
    return {
      status:'ok'
    };
  }
}
