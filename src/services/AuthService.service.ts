import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/app.config';
// import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {

  public urls: any = {
    'login': API_URL + '/user/login',
    'logout': API_URL + '/user/logout',
    'refresh': API_URL + '/user/refresh',
    'profile': API_URL + '/user/profile',
    'list' : API_URL + '/user/list'
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
  
  public login(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.urls['login'], info, { headers: headers });
  }

  public logout() {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  }
}