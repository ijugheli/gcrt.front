import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {
  constructor() { }
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

  public authorize(o: any) {
    if (o == null) {
      return;
    }

    localStorage.setItem("auth", JSON.stringify(o));
  }
}