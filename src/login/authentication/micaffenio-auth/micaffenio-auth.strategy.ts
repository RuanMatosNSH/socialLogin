import { Strategy } from 'passport-local';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { MicaffenioAuthService } from './micaffenio-auth.service';

@Injectable()
export class MicaffenioStrategy extends PassportStrategy(
  Strategy,
  'micaffenio',
) {
  private readonly logger = new Logger(MicaffenioStrategy.name);

  constructor(private readonly usMicaffenioService: MicaffenioAuthService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<any> => {
    if (username && password) {
      try {
        const userToken = await this.usMicaffenioService.userLogin(
          username,
          password,
        );
        const userInfo = await this.usMicaffenioService.userInfo(
          userToken.token,
        );

        const { firstName, lastName } = this.normalizeName(
          userInfo.name,
          userInfo.lastName,
        );

        const dateOfBirth = this.normalizeDateOfBirth(userInfo.birthDate);
        const xEmployeeUser = /(^| )Empleado( |$)|(^| )Emp( |$)/i.test(
          userInfo.level,
        );
        return {
          email: userInfo.email,
          firstName,
          lastName,
          dateOfBirth,
          xPhoneNumber: userInfo.phone,
          xOccupation: userInfo.occupation,
          xIdMiCaffenio: userInfo.id,
          xEmployeeUser,
          custom: {
            token: userToken.token,
          },
        };
      } catch (ex) {
        this.logger.log(ex.message);
        return false;
      }
    }
    throw new UnauthorizedException();
  };

  private normalizeDateOfBirth(birthDate: string): string {
    try {
      const d = birthDate.split('/');
      return new Date(d[2] + '/' + d[1] + '/' + d[0]).toISOString();
    } catch (ex) {
      this.logger.warn(
        `normalizeBirthDate - cannot convert to date - birthDate: ${birthDate}`,
      );
      return null;
    }
  }

  private normalizeName(
    firstName: string,
    lastName: string,
  ): { firstName: string; lastName: string } {
    if (lastName) {
      return {
        firstName: firstName,
        lastName: lastName,
      };
    }

    const splitName = firstName.split(' ');
    if (splitName.length > 0) {
      return {
        firstName: splitName.slice(0, -1).join(' '),
        lastName: splitName.slice(-1).join(' '),
      };
    }

    return {
      firstName: firstName,
      lastName: firstName,
    };
  }
}
