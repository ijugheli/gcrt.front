import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './AuthService.service';
import { CacheService } from './cache.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    public token: string | null = null;
    constructor(
        private router: Router,
        private authService: AuthService,
        private cacheService: CacheService,
    ) {
    }

    private handleAuthError(err: any) {
        if (err.status === 401 || err.status === 403) {

            this.router.navigate(['login'], { 'replaceUrl': true })

            return of(err.message);
        }
        return throwError(err);
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.token = this.cacheService.get('auth')?.access_token;
        if (this.token) {
            request = request.clone({
                setHeaders: {
                    'Content-type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${this.token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError(x => this.handleAuthError(x)),
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    let refreshToken: string | undefined = event.body['refresh_token'];

                    if (typeof refreshToken !== 'undefined') {
                        const auth = this.cacheService.get('auth');

                        // Update Auth cache
                        if (auth !== null) {
                            auth['access_token'] = refreshToken;
                            this.cacheService.set('auth', auth, auth.expires_at);
                            delete event.body['refresh_token'];
                        }

                        return event;
                    }
                }
                return event;
            }));
    }
}