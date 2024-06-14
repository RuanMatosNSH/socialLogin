import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdentityProviderOcc } from './identity-provider-occ/identity-provider-occ';
import { LoginRequest } from './identity-provider-occ/login';

@Injectable()
export class AuthorizationService {
  private providers: IdentityProviderOcc[];
  private static keys: {
    privateKey: string;
    publicKey: string;
  };

  constructor(private readonly configService: ConfigService) {
    type spCertType = {
      host: string;
      cert: string;
    };
    const spsCert = this.configService.get<spCertType[]>('sp');

    type idpType = {
      privateKey: string;
      publicKey: string;
    };
    const keys = this.configService.get<idpType>('idp');

    AuthorizationService.keys = keys;

    this.providers = spsCert.reduce(
      (acc, k) => ({
        ...(acc as any),
        [k.host]: new IdentityProviderOcc(
          {
            metadata: Buffer.from(k.cert, 'base64'),
          },
          {
            privateKey: Buffer.from(keys.privateKey),
            signingCert: Buffer.from(keys.publicKey),
          },
        ),
      }),
      {},
    );
  }

  public getProvider(url: string): IdentityProviderOcc {
    const id = Object.keys(this.providers).find((k) => url?.includes(k));
    if (!id) {
      throw new Error('service provider "' + url + '" not found');
    }
    return this.providers[id];
  }

  public createLoginResponse(url: string, user: LoginRequest) {
    return this.getProvider(url).createLoginResponse(user);
  }

  public getIdentityProviderDescriptor(encode: boolean) {
    return IdentityProviderOcc.getIdentityProviderDescriptor(
      Buffer.from(AuthorizationService.keys.publicKey),
      encode,
    );
  }
}
