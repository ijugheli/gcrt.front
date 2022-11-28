import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { GuardedService, User } from '../app/app.models';
import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GuardedService {

  public urls: any = {
    'list': API_URL + '/user/list',
    'add': API_URL + '/user/add',
    'edit': API_URL + '/user/edit/{user_id}',
    'details': API_URL + '/user/{user_id}',
    'changePassword': API_URL + '/user/changePassword',
    'delete': API_URL + '/user/{user_id}',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public list(): Observable<User[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get<User[]>(this.urls['list'], { headers: this.headers });
  }

  public details(userID: number): Observable<User> {
    return this.http.get<User>(this.urls['details'].replace('{user_id}', userID), { headers: this.headers });
  }

  public add(values: any) {
    return this.http.post(this.urls['add'], values, { headers: this.headers });
  }

  public edit(userID: number, values: any) {
    return this.http.post(this.urls['edit'].replace('{user_id}', userID), values, { headers: this.headers });
  }

  public changePassword(values: any) {
    return this.http.post(this.urls['changePassword'], values, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  public delete(userID: number) {
    return this.http.delete(this.urls['delete'].replace('{user_id}', userID), { headers: this.headers });
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

}
