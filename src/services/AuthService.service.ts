import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { API_URL } from 'src/app/app.config';
import { APIResponse } from 'src/app/app.interfaces';
import { CacheService } from './cache.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public urls: any = {
    'login': API_URL + '/user/login',
    'logout': API_URL + '/user/logout',
    'refresh': API_URL + '/user/refresh',
    'profile': API_URL + '/user/profile',
    'list': API_URL + '/user/list',
    'sendCode': API_URL + '/user/send-code',
    'validateCode': API_URL + '/user/validate-code',
  };
  public authStatus$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private cacheService: CacheService, private router: Router) {
  }

  public getToken() {
    const auth = this.cacheService.get('auth');

    if (auth == null) {
      this.authStatus$.next(false);
      return null;
    }

    this.authStatus$.next(true);
    return auth.access_token;
  }

  public getOTPEmail() {
    const email: string | null = localStorage.getItem('otp');

    return email;
  }

  public removeOTPEmail() {
    localStorage.removeItem('otp');
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

    this.cacheService.set('auth', o, o.expires_at);
    this.authStatus$.next(true);
  }

  public sendCode(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<APIResponse>(this.urls['sendCode'], info, { headers: headers });
  }

  public validateCode(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<APIResponse>(this.urls['validateCode'], info, { headers: headers });
  }

  public login(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<APIResponse>(this.urls['login'], info, { headers: headers });
  }

  public logout() {
    this.cacheService.remove('auth');
    this.authStatus$.next(false);
    this.router.navigate(['login'], { replaceUrl: true });
  }
}