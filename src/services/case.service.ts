import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, ICaseCol, ICustomInput, IUserPermission } from 'src/app/app.interfaces';
import { Attribute, GuardedService, User } from '../app/app.models';
import { AuthService } from './AuthService.service';
import { parseTree } from 'src/app/app.func';
import { consultationCols } from 'src/pages/case/case-attrs/consultation';
import { diagnosisCols } from 'src/pages/case/case-attrs/diagnosis';
import { referralCols } from 'src/pages/case/case-attrs/referral';
import { caseCols, caseList } from 'src/pages/case/case-attrs/case';
import { IDiagnosis, IConsultation, IReferral, CaseAttrs, Case, ICase } from 'src/pages/case/case.model';

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
  public isValidationEnabled: boolean = false;
  public isInputDisabled: boolean = false;
  public cases: Map<number, ICase> = new Map();
  public values: Map<number | string, string | Date | null | boolean | number> = new Map();
  public urls: any = {
    'index': API_URL + '/case/index',
    'show': API_URL + '/case/show/{id}',
    'store': API_URL + '/case/store',
    'destroy': API_URL + '/case/destroy/{id}',
    'updateDiagnosis': API_URL + '/case/diagnosis/update',
    'updateConsultation': API_URL + '/case/consultation/update',
    'updateReferral': API_URL + '/case/referral/update',
    'updateFormsOfViolence': API_URL + '/case/forms-of-violence/update',
    'updateCarePlans': API_URL + '/case/care-plans/update',
    'destroyConsultation': API_URL + '/case/consultation/destroy/{id}',
    'destroyReferral': API_URL + '/case/referral/destroy/{id}',
    'destroyDiagnosis': API_URL + '/case/diagnosis/destroy/{id}',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public index(): Observable<APIResponse<ICase[]>> {
    return this.http.get<APIResponse<ICase[]>>(this.urls['index'], { headers: this.headers });
  }
  public show(id: number): Observable<APIResponse<ICase>> {
    return this.http.get<APIResponse<ICase>>(this.urls['show'].replace('{id}', id.toString()), { headers: this.headers });
  }

  public destroy(caseID: number): Observable<APIResponse<ICase[]>> {
    return this.http.delete<APIResponse<ICase[]>>(this.urls['destroy'].replace('{id}', caseID.toString()), { headers: this.headers });
  }

  public destroyReferral(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyReferral'].replace('{id}', id.toString()), { headers: this.headers });
  }

  public destroyDiagnosis(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyDiagnosis'].replace('{id}', id.toString()), { headers: this.headers });
  }

  public destroyConsultation(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyConsultation'].replace('{id}', id.toString()), { headers: this.headers });
  }

  public storeCase(data: any): Observable<APIResponse<ICase>> {
    return this.http.post<APIResponse<ICase>>(this.urls['store'], data, { headers: this.headers });
  }

  public updateDiagnosis(data: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateDiagnosis'], data, { headers: this.headers });
  }

  public updateConsultation(data: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateConsultation'], data, { headers: this.headers });
  }

  public updateReferral(data: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateReferral'], data, { headers: this.headers });
  }

  public updateFormsOfViolence(data: any): Observable<any> {
    return this.http.post<APIResponse>(this.urls['updateFormsOfViolence'], data, { headers: this.headers });
  }

  public parseTreeData(response: APIResponse<Attribute[]>) {
    const data: any = response.data!;

    return parseTree(data['tree']);
  }

  public mapCases(cases: ICase[]): void {
    this.cases = new Map(cases.map(e => [e['case'].id!, e as ICase]));
  }

  // validate new section model / check if it has atleast 1 filled field
  public isValidNewModel(model: IDiagnosis | IConsultation | IReferral): boolean {
    const defaultKeys = ['generated_id', 'setNodeID'];
    const keys = Object.keys(model);

    return (keys.length > defaultKeys.length);
  }

  public isValidModel(model: IDiagnosis | IConsultation | IReferral, attrs: ICustomInput[]): boolean {
    this.isValidationEnabled = true;

    const invalids: ICustomInput[] = attrs.filter((attr: any) => {
      if (!attr['isRequired']) return false;

      return model[attr['fieldName']] === null || model[attr['fieldName']] === undefined;
    });

    return invalids.length <= 0;
  }

  // validate case only because others are validated on section update
  public validate(): boolean {
    this.isValidationEnabled = true;
    const list = Array.from(caseList);

    let invalids = list.filter((attr: any) => {
      if (!attr['isRequired']) return false;

      return this.values.get(attr['fieldName']) === null || this.values.get(attr['fieldName']) === undefined;
    });

    return invalids.length <= 0;
  }
}
