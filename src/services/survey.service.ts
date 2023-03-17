import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, IUserPermission } from 'src/app/app.interfaces';
import { GuardedService, ISymptomSurveyResult, User } from '../app/app.models';
import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends GuardedService {

  public surveys: [] = [];

  public urls: any = {
    'survey': API_URL + '/survey/{attr_id}',
    'store': API_URL + '/survey/store',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public survey(attrID: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.urls['survey'].replace('{attr_id}', attrID), { headers: this.headers });
  }

  public store(data: any): Observable<any> {
    return this.http.post<APIResponse<ISymptomSurveyResult[]>>(this.urls['store'], data, {headers: this.headers});
  }

}
