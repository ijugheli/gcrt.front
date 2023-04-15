import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, IUserPermission } from 'src/app/app.interfaces';
import { Attribute, GuardedService, User } from '../app/app.models';
import { AuthService } from './AuthService.service';
import { parseTree } from 'src/app/app.func';
import { ICarePlan } from 'src/pages/case/case.model';
import { consultationCols } from 'src/pages/case/case-attrs/consultation';
import { diagnosisCols } from 'src/pages/case/case-attrs/diagnosis';
import { referralCols } from 'src/pages/case/case-attrs/referral';
import { caseCols } from 'src/pages/case/case-attrs/case';
import { ICaseCol } from 'src/pages/client/client.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService extends GuardedService {
  public carePlanTree: any[] = [];
  public formsOfViolenceTree: any[] = [];
  public diagnosisCols: ICaseCol[] = diagnosisCols;
  public referralCols: ICaseCol[] = referralCols;
  public consultationCols: ICaseCol[] = consultationCols;
  public caseCols: ICaseCol[] = caseCols;

  public urls: any = {
    'create': API_URL + '/case/add',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public create(data: any): Observable<any> {
    return this.http.post(this.urls['create'], data, { headers: this.headers });
  }

  public parseTreeData(response: APIResponse<Attribute[]>) {
    const data: any = response.data!;

    return parseTree(data['tree']);
  }
}
