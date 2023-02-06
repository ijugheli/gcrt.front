import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                event = event.clone();

                const refreshToken: string | undefined = event.body['refresh_token'];
                if (refreshToken !== undefined) {
                    const auth = localStorage.getItem('auth');

                    if (auth !== null) {
                        const info = JSON.parse(auth);
                        info['access_token'] = refreshToken;
                        localStorage.setItem('auth', JSON.stringify(info));
                        delete event.body['refresh_token'];
                    }

                    return event;
                }
            }
            return event;
        }));
    }
}