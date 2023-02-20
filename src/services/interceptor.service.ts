import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AttributesService } from './attributes/Attributes.service';
import { RecordsService } from './attributes/Records.service';
import { UserService } from './user.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(
        private userService: UserService,
        private attrService: AttributesService,
        private recordsService: RecordsService
    ) {
        console.log('Interceptor Created');
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('Intercept Method Activated');
        console.log(request);
        console.log(next);

        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('Interceptor : HTTP Response');
                const refreshToken: string | undefined = event.body['refresh_token'];

                if (typeof refreshToken !== 'undefined') {
                    const auth = localStorage.getItem('auth');

                    this.refreshTokens(refreshToken);

                    // Update Auth cache
                    if (auth !== null) {
                        const info = JSON.parse(auth);
                        info['access_token'] = refreshToken;
                        localStorage.setItem('auth', JSON.stringify(info));
                        delete event.body['refresh_token'];
                    }

                    return event;
                }
            } else {
                console.log('Interceptor : not HTTP Response');
            }
            return event;
        }));
    }

    // Set refreshToken for services using guardedService
    private refreshTokens(refreshToken: string): void {
        this.userService.refreshToken(refreshToken);
        this.attrService.refreshToken(refreshToken);
        this.recordsService.refreshToken(refreshToken);
    }
}