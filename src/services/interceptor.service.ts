import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AttributesService } from './attributes/Attributes.service';
import { RecordsService } from './attributes/Records.service';
import { UserService } from './user.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(
    ) {

    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
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
            }
            return event;
        }));
    }

    // Set refreshToken for services using guardedService
    private refreshTokens(refreshToken: string): void {
        const userService = inject(UserService);
        const attrService = inject(AttributesService);
        const recordsService = inject(RecordsService);

        userService.refreshToken(refreshToken);
        attrService.refreshToken(refreshToken);
        recordsService.refreshToken(refreshToken);
    }
}