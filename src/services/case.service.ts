import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, ICaseCol, ICustomInput } from 'src/app/app.interfaces';
import { Attribute, GuardedService, User } from '../app/app.models';
import { AuthService } from './AuthService.service';
import { formatDate, parseTree } from 'src/app/app.func';
import { consultationCols } from 'src/pages/case/case-attrs/consultation';
import { diagnosisCols } from 'src/pages/case/case-attrs/diagnosis';
import { referralCols } from 'src/pages/case/case-attrs/referral';
import { caseCols, caseList } from 'src/pages/case/case-attrs/case';
import { IDiagnosis, IConsultation, IReferral, ICase, checkCaseKeys, MCase, MCaseMain, MDiagnosis, MConsultation, MReferral, ICaseMain, IFormOfViolence, ICarePlan, ParsedCases } from 'src/pages/case/case.model';
import { MOption } from './attributes/models/option.model';
import { CacheService } from './cache.service';
import { AttributesService } from './attributes/Attributes.service';
import { IClientMain } from 'src/pages/client/client.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
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
  // dropdown options for case manager and client 
  public caseManagers: Map<number, MOption> = new Map();
  public clients: Map<number, MOption> = new Map();
  public caseManagerChanges: AsyncSubject<Map<number, MOption>> = new AsyncSubject<Map<number, MOption>>();
  public clientChanges: AsyncSubject<Map<number, MOption>> = new AsyncSubject<Map<number, MOption>>();

  public cases: Map<number, ICase> = new Map();
  public parsedCases: Map<number, MCase> = new Map();

  public values: Map<number | string, string | Date | null | boolean | number> = new Map();

  // for Case section detail table clicks
  public selectedSection: number | null = null;
  public selectedSectionModel: any | null = null;

  public urls: any = {
    'index': API_URL + '/case/index',
    'show': API_URL + '/case/show/{id}',
    'store': API_URL + '/case/store',
    'destroy': API_URL + '/case/destroy/{id}',
    'updateDiagnosis': API_URL + '/case/diagnosis/update',
    'updateConsultation': API_URL + '/case/consultation/update',
    'updateReferral': API_URL + '/case/referral/update',
    'updateFormsOfViolences': API_URL + '/case/forms-of-violence/update/{case_id}',
    'updateCarePlans': API_URL + '/case/care-plan/update/{case_id}',
    'destroyConsultation': API_URL + '/case/consultation/destroy/{id}',
    'destroyReferral': API_URL + '/case/referral/destroy/{id}',
    'destroyDiagnosis': API_URL + '/case/diagnosis/destroy/{id}',
    'caseManagers': API_URL + '/case/case-managers',
    'clients': API_URL + '/case/clients',
  };

  constructor(private http: HttpClient, private auth: AuthService, private cacheService: CacheService, private attrService: AttributesService, private datePipe: DatePipe) {
    super(auth.getToken());
  }

  public index(): Observable<APIResponse<ParsedCases>> {
    return this.http.get<APIResponse<any>>(this.urls['index'], { headers: this.headers }).pipe(map(data => this.mapCaseResponse(data)));
  }
  public show(id: number): Observable<APIResponse<ICase>> {
    return this.http.get<APIResponse<ICase>>(this.urls['show'].replace('{id}', id.toString()), { headers: this.headers });
  }

  public destroy(caseID: number): Observable<APIResponse<ParsedCases>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroy'].replace('{id}', caseID.toString()), { headers: this.headers }).pipe(map(data => this.mapCaseResponse(data)));
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

  public storeCase(data: ICase): Observable<APIResponse<ICase>> {
    return this.http.post<APIResponse<ICase>>(this.urls['store'], data, { headers: this.headers });
  }

  public updateDiagnosis(data: IDiagnosis[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateDiagnosis'], data, { headers: this.headers });
  }

  public updateConsultation(data: IConsultation[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateConsultation'], data, { headers: this.headers });
  }

  public updateReferral(data: IReferral[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateReferral'], data, { headers: this.headers });
  }

  public updateFormsOfViolences(data: IFormOfViolence[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateFormsOfViolences'].replace('{case_id}', caseID.toString()), data, { headers: this.headers });
  }
  public updateCarePlans(data: ICarePlan[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateCarePlans'].replace('{case_id}', caseID.toString()), data, { headers: this.headers });
  }

  public getClients(): Observable<APIResponse<IClientMain[]>> {
    return this.http.get<APIResponse<IClientMain[]>>(this.urls['clients'], { headers: this.headers });
  }

  public getCaseManagers(): Observable<APIResponse<User[]>> {
    return this.http.get<APIResponse<User[]>>(this.urls['caseManagers'], { headers: this.headers });
  }

  public async initClients(shouldRefresh: boolean = false): Promise<void> {
    const cache = this.cacheService.get('clients');

    if (cache != null && !shouldRefresh) {
      this.clients = new Map(cache);
      this.clientChanges.next(this.clients);
      this.clientChanges.complete();
      return;
    }

    this.getClients().subscribe((data: APIResponse<IClientMain[]>) => {
      const response: any[] = data.data!.map((value: IClientMain) => {
        return [value.id, {
          id: value.id,
          name: value.client_code + ' ' + value.name + ' ' + value.surname
        } as MOption
        ];
      });

      this.clients = new Map(response);
      this.clientChanges.next(this.clients);
      this.clientChanges.complete();
      this.cacheService.set('clients', Array.from(this.clients.entries()));
    });
  }

  public async initCaseManagers(shouldRefresh: boolean = false): Promise<void> {
    const cache = this.cacheService.get('case_managers');

    if (cache != null && !shouldRefresh) {
      this.caseManagers = new Map(cache);
      this.caseManagerChanges.next(this.caseManagers);
      this.caseManagerChanges.complete();
      return;
    }

    this.getCaseManagers().subscribe((data: APIResponse<User[]>) => {
      const response: any[] = data.data!.map((value: User) => {
        return [value.id, {
          id: value.id,
          name: value.name + ' ' + value.lastname
        } as MOption
        ];
      });

      this.caseManagers = new Map(response);
      this.caseManagerChanges.next(this.caseManagers);
      this.caseManagerChanges.complete();
      this.cacheService.set('case_managers', Array.from(this.caseManagers.entries()));
    })
  }

  public parseTreeData(response: APIResponse<Attribute[]>) {
    const data: any = response.data!;

    return parseTree(data['tree']);
  }

  public mapCases(cases: ICase[]): ParsedCases {
    this.parsedCases = new Map();
    this.cases = new Map(cases.map(e => {
      const item: ICase = new ICase(e);
      this.parsedCases.set(e.case.id!, this.parseCase(item));
      return [e.case.id!, item];
    }));

    return { cases: this.caseList(), parsedCases: this.parsedCaseList() };
  }

  // validate new section model / check if it has atleast 1 filled field
  public isValidNewModel(model: IDiagnosis | IConsultation | IReferral): boolean {
    this.isValidationEnabled = true;
    const defaultKeys: string[] = ['generated_id', 'setNodeID'];
    const keys: string[] = Object.keys(model);

    return (keys.length > defaultKeys.length);
  }

  public isValidModel(model: IDiagnosis | IConsultation | IReferral, attrs: ICustomInput[]): boolean {
    this.isValidationEnabled = true;

    const invalids: ICustomInput[] = attrs.filter((attr: any) => {
      let value = model[attr['fieldName']];

      if (!attr['isRequired']) return false;

      return value === null || value === undefined;
    });

    return invalids.length <= 0;
  }

  // validate case only because others are validated on section update
  public validate(): boolean {
    this.isValidationEnabled = true;
    const list: ICustomInput[] = Array.from(caseList);

    let invalids: ICustomInput[] = list.filter((attr: any) => {
      if (!attr['isRequired']) return false;

      const value = this.values.get(attr['fieldName']);

      if (attr['type'] === 'text') {
        return value === null || value === undefined || value === '';
      }

      return value === null || value === undefined;
    });

    return invalids.length <= 0;
  }

  public getClientName(id: number): string {
    return this.clients.get(id)!.name;
  }

  public getCaseManagerName(id: number): string {
    return this.caseManagers.get(id)!.name;
  }

  public parseCase(iCase: any) {
    const item = Object.assign({}, iCase);
    const keys: string[] = ['diagnoses', 'consultations', 'referrals'];
    item.case = this.parseSection(item.case) as MCaseMain;

    keys.forEach((key: string) => {
      if (item?.[key].length > 0) {
        item[key] = item[key].map((item: IDiagnosis | IConsultation | IReferral) => this.parseSection(item));
      }
    })

    return new MCase(item);
  }

  // set dropdown and treeselect option titles for case table ui and searching
  public parseSection(data: ICaseMain | IDiagnosis | IConsultation | IReferral) {
    return Object.entries(data).reduce((item: any, [key, value]: [string, any]) => {
      if (key == 'case_manager_id') {
        item[key] = this.getCaseManagerName(value);
      } else if (key == 'client_id') {
        item[key] = this.getClientName(value);
      } else if (checkCaseKeys(key)) {
        item[key] = this.attrService.getOptionTitle(value);
      } else {
        item[key] = value;
      }

      return item;
    }, {});
  }

  private mapCaseResponse(data: APIResponse<any>): APIResponse<ParsedCases> {
    data.data = this.mapCases(data.data!) as ParsedCases;
    return data as APIResponse<ParsedCases>;
  }

  public caseList() {
    return Array.from(this.cases.values());
  }

  public parsedCaseList() {
    return Array.from(this.parsedCases.values());
  }
}
