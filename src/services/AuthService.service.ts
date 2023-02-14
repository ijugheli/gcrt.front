import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/app.config';
import { IResponse } from 'src/app/app.interfaces';
// import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {

  public urls: any = {
    'login': API_URL + '/user/login',
    'logout': API_URL + '/user/logout',
    'refresh': API_URL + '/user/refresh',
    'profile': API_URL + '/user/profile',
    'list': API_URL + '/user/list',
    'sendCode': API_URL + '/user/send-recovery-link',
    'validateCode': API_URL + '/user/validate-recovery-link',
  };

  constructor(private http: HttpClient) {

  }

  public isAuthenticated(): boolean {
    const auth = localStorage.getItem('auth')
    if (auth == null) {
      return false;
    }

    const info = JSON.parse(auth);
    const token = info.access_token;

    return token != null;
  }

  public getToken() {
    const auth = localStorage.getItem('auth')
    if (auth == null) {
      return false;
    }

    const info = JSON.parse(auth);

    return info.access_token;
  }

  public getOTPEmail() {
    const email: string | null = localStorage.getItem('otp');

    localStorage.removeItem('otp');

    return email;
  }

  public storeOTPEmail(data: string) {
    localStorage.setItem('otp', data);
  }

  public getHeader() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    headers.set('bearer', this.getToken());
    return headers;
  }

  public authorize(o: any) {
    if (o == null) {
      return;
    }

    localStorage.setItem("auth", JSON.stringify(o));
  }

  public sendCode(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<IResponse>(this.urls['sendCode'], info, { headers: headers });
  }
  public validateCode(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<IResponse>(this.urls['validateCode'], info, { headers: headers });
  }

  public login(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<IResponse>(this.urls['login'], info, { headers: headers });
  }

  public logout() {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  }
}