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
export class ClientService extends GuardedService {

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
}
