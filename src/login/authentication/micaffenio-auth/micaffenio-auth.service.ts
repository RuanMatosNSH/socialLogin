import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class MicaffenioAuthService {
  constructor(private readonly httpService: HttpService) {}

  public userLogin(username: string, password: string): Promise<any> {
    return lastValueFrom(
      this.httpService
        .post('/login', {
          username,
          password,
        })
        .pipe(map((resp) => resp.data)),
    );
  }

  public userInfo(token: string): Promise<any> {
    return lastValueFrom(
      this.httpService
        .get('/account', {
          headers: { token },
        })
        .pipe(map((resp) => resp.data)),
    );
  }
}
