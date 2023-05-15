import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { AuthService } from './AuthService.service';
import { map, catchError, of, Observable } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.authStatus$.pipe(map((isAuth: boolean) => {
      if(!isAuth) {
        this.router.navigateByUrl('/login');
      }
      return isAuth;
    }));
  }
}