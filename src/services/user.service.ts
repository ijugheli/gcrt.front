import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public urls: any = {
    'login': 'http://localhost:8000/user/login',
    'logout': 'http://localhost:8000/user/logout',
    'refresh': 'http://localhost:8000/user/refresh',
    'profile': 'http://localhost:8000/user/profile',
  };

  constructor(private http: HttpClient) {

  }

  public login(info: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.urls['login'], info, { headers: headers });
  }


}
