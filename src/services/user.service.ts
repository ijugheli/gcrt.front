import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  public delete(userID: number) {
    return this.http.delete(this.urls['delete'].replace('{user_id}', userID), { headers: this.headers });
  }
}
