import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, IUserPermission } from 'src/app/app.interfaces';
import { GuardedService, User } from '../app/app.models';
import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GuardedService {

  public users: User[] = [];

  public urls: any = {
    'list': API_URL + '/users/list',
    'add': API_URL + '/users/add',
    'edit': API_URL + '/users/edit/{user_id}',
    'details': API_URL + '/users/{user_id}',
    'changePassword': API_URL + '/users/changePassword',
    'delete': API_URL + '/users/{user_id}',
    'updatePermission': API_URL + '/users/permissions/{user_id}/{attr_id}',
    'updateBooleanProperties': API_URL + '/users/update-boolean-properties/{user_id}',
    'updatePassword': API_URL + '/users/update-password',
    'getReport': API_URL + '/user/report',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public list(): Observable<APIResponse<User[]>> {
    return this.http.get<APIResponse<User[]>>(this.urls['list'], { headers: this.headers });
  }

  public details(userID: number): Observable<User> {
    return this.http.get<User>(this.urls['details'].replace('{user_id}', userID), { headers: this.headers });
  }

  public add(values: any) {
    return this.http.post<APIResponse>(this.urls['add'], values, { headers: this.headers });
  }

  public edit(userID: number, values: any) {
    return this.http.post<APIResponse>(this.urls['edit'].replace('{user_id}', userID), values, { headers: this.headers });
  }

  public getReport() {
    return this.http.get(this.urls['getReport'], { headers: this.headers });
  }

  public changePassword(values: any) {
    return this.http.post(this.urls['changePassword'], values, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  public delete(userID: number) {
    return this.http.delete(this.urls['delete'].replace('{user_id}', userID), { headers: this.headers });
  }

  public saveAttrPermission(userID: number, attrID: number, values: any) {
    return this.http.post<APIResponse<IUserPermission>>(this.urls['updatePermission'].replace('{user_id}', userID).replace('{attr_id}', attrID), values, { headers: this.headers });
  }

  public updateBooleanColumns(userID: number, values: any) {
    return this.http.post<APIResponse>(this.urls['updateBooleanColumns'].replace('{user_id}', userID), values, { headers: this.headers });
  }

  public updatePassword(data: any) {
    return this.http.post<APIResponse>(this.urls['updatePassword'], data, { headers: this.headers });
  }

  public me() {
    const auth = localStorage.getItem('auth');

    if (auth == null) {
      return null;
    }

    const info = JSON.parse(auth);

    return info.user as User;
  }

  private handleError(error: HttpErrorResponse) {
    let response = 'ოპერაცია ვერ შესრულდა. გთხოვთ სცადოთ სხვა მონაცემები.';
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      if (error.error.hasOwnProperty('StatusMessage')) {
        response = error.error.StatusMessage;
      }

    }
    // Return an observable with a user-facing error message.
    return throwError(() => response);
  }

  public async getUser(userID: number) {
    let user = this.users.find((user) => user.id == userID) || null;

    if (user != null) return user;

    user = await lastValueFrom(this.details(userID)) || null;

    return user;
  }

}
