import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, ICustomInput } from 'src/app/app.interfaces';
import { Attribute, User } from '../app/app.models';
import { parseTree } from 'src/app/app.func';
import { caseList } from 'src/pages/case/case-attrs/case';
import { IDiagnosis, IConsultation, IReferral, ICase, checkCaseKeys, MCase, MCaseMain, ICaseMain, ICarePlan, ParsedCases, ISymptom, MSymptom, IOtherSymptom, IMentalSymptom, ISomaticSymptom, MSomaticSymptom } from 'src/pages/case/case.model';
import { MOption } from './attributes/models/option.model';
import { CacheService } from './cache.service';
import { AttributesService } from './attributes/Attributes.service';
import { IClientMain } from 'src/pages/client/client.model';
import { mentalSymptomMap } from 'src/pages/case/case-attrs/mental-symptom';
import { somaticSymptomMap } from 'src/pages/case/case-attrs/somatic-symptom';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  public carePlanTree: any[] = [];
  public formsOfViolenceTree: any[] = [];
  public isValidationEnabled: boolean = false;
  public isInputDisabled: boolean = false;
  // dropdown options for case manager and client 
  public caseManagers: Map<number, MOption> = new Map();
  public clients: Map<number, MOption> = new Map();
  public caseManagers$: AsyncSubject<Map<number, MOption>> = new AsyncSubject<Map<number, MOption>>();
  public clients$: AsyncSubject<Map<number, MOption>> = new AsyncSubject<Map<number, MOption>>();

  public cases: Map<number, ICase> = new Map();
  public parsedCases: Map<number, MCase> = new Map();

  public values: Map<number | string, string | Date | null | boolean | number> = new Map();

  // for Case section detail table clicks
  public selectedSection: number | null = null;
  public selectedSectionModel: any | null = null;

  // symptom options for form
  public mentalSymptomOptions: MOption[] = [];
  public somaticSymptomOptions: MOption[] = [];

  public urls: any = {
    'index': API_URL + '/case/index',
    'show': API_URL + '/case/show/{id}',
    'store': API_URL + '/case/store',
    'destroy': API_URL + '/case/destroy/{id}',
    'updateDiagnosis': API_URL + '/case/diagnosis/update',
    'updateConsultation': API_URL + '/case/consultation/update',
    'updateReferral': API_URL + '/case/referral/update',
    'updateFormsOfViolences': API_URL + '/case/forms-of-violence/update/{case_id}',
    'updateMentalSymptoms': API_URL + '/case/mental-symptom/update/{case_id}',
    'updateSomaticSymptoms': API_URL + '/case/somatic-symptom/update/{case_id}',
    'updateOtherSymptoms': API_URL + '/case/other-symptom/update/{case_id}',
    'destroyMentalSymptoms': API_URL + '/case/mental-symptom/destroy/{case_id}',
    'destroySomaticSymptoms': API_URL + '/case/somatic-symptom/destroy/{case_id}',
    'destroyOtherSymptoms': API_URL + '/case/other-symptom/destroy/{id}',
    'updateCarePlans': API_URL + '/case/care-plan/update/{case_id}',
    'destroyConsultation': API_URL + '/case/consultation/destroy/{id}',
    'destroyReferral': API_URL + '/case/referral/destroy/{id}',
    'destroyDiagnosis': API_URL + '/case/diagnosis/destroy/{id}',
    'caseManagers': API_URL + '/case/case-managers',
    'clients': API_URL + '/case/clients',
  };

  constructor(private http: HttpClient, private cacheService: CacheService, private attrService: AttributesService) {
  }

  public index(): Observable<APIResponse<ParsedCases>> {
    return this.http.get<APIResponse<any>>(this.urls['index'],).pipe(map(data => this.mapCaseResponse(data)));
  }
  public show(id: number): Observable<APIResponse<ICase>> {
    return this.http.get<APIResponse<ICase>>(this.urls['show'].replace('{id}', id.toString()),);
  }

  public destroy(caseID: number): Observable<APIResponse<ParsedCases>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroy'].replace('{id}', caseID.toString()),).pipe(map(data => this.mapCaseResponse(data)));
  }

  public destroyReferral(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyReferral'].replace('{id}', id.toString()),);
  }

  public destroyDiagnosis(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyDiagnosis'].replace('{id}', id.toString()),);
  }

  public destroyConsultation(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyConsultation'].replace('{id}', id.toString()),);
  }

  public storeCase(data: ICase): Observable<APIResponse<ICase>> {
    return this.http.post<APIResponse<ICase>>(this.urls['store'], data,);
  }

  public updateDiagnosis(data: IDiagnosis[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateDiagnosis'], data,);
  }

  public updateConsultation(data: IConsultation[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateConsultation'], data,);
  }

  public updateReferral(data: IReferral[]): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['updateReferral'], data,);
  }

  public updateFormsOfViolences(data: ISymptom[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateFormsOfViolences'].replace('{case_id}', caseID.toString()), data,);
  }

  public updateCarePlans(data: ICarePlan[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateCarePlans'].replace('{case_id}', caseID.toString()), data,);
  }

  public updateMentalSymptoms(data: ISymptom[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateMentalSymptoms'].replace('{case_id}', caseID.toString()), data,);
  }

  public updateSomaticSymptoms(data: ISymptom[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateSomaticSymptoms'].replace('{case_id}', caseID.toString()), data,);
  }
  public updateOtherSymptoms(data: ISymptom[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['updateOtherSymptoms'].replace('{case_id}', caseID.toString()), data,);
  }

  public destroyMentalSymptoms(data: number[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['destroyMentalSymptoms'].replace('{case_id}', caseID.toString()), { data: data },);
  }

  public destroySomaticSymptoms(data: number[], caseID: number): Observable<APIResponse<any>> {
    return this.http.post<APIResponse<any>>(this.urls['destroySomaticSymptoms'].replace('{case_id}', caseID.toString()), { data: data },);
  }

  public destroyOtherSymptoms(id: number): Observable<APIResponse<any>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroyOtherSymptoms'].replace('{id}', id.toString()));
  }

  public getClients(): Observable<APIResponse<IClientMain[]>> {
    return this.http.get<APIResponse<IClientMain[]>>(this.urls['clients'],);
  }

  public getCaseManagers(): Observable<APIResponse<User[]>> {
    return this.http.get<APIResponse<User[]>>(this.urls['caseManagers'],);
  }

  public async initClients(shouldRefresh: boolean = false): Promise<void> {
    const cache = this.cacheService.get('clients');

    if (cache != null && !shouldRefresh) {
      this.mapClients(cache);
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

      this.mapClients(response);
      this.cacheService.set('clients', Array.from(this.clients.entries()));
    });
  }

  public async initCaseManagers(shouldRefresh: boolean = false): Promise<void> {
    const cache = this.cacheService.get('case_managers');

    if (cache != null && !shouldRefresh) {
      this.mapCaseManagers(cache);
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

      this.mapCaseManagers(response);
      this.cacheService.set('case_managers', Array.from(this.caseManagers.entries()));
    })
  }

  public initSymptomOptions() {
    this.attrService.getPropertyMap().subscribe((properties) => {
      this.mentalSymptomOptions = properties.get(mentalSymptomMap.get('symptom_id').propertyID)?.source.options;
      this.somaticSymptomOptions = properties.get(somaticSymptomMap.get('symptom_id').propertyID)?.source.options;
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
  public isValidNewModel(model: IDiagnosis | IConsultation | IReferral | IOtherSymptom): boolean {
    this.isValidationEnabled = true;
    const defaultKeys: string[] = ['generated_id', 'setNodeID'];
    const keys: string[] = Object.keys(model);

    return (keys.length > defaultKeys.length);
  }

  public isValidModel(model: IDiagnosis | IConsultation | IReferral | IOtherSymptom, attrs: ICustomInput[]): boolean {
    this.isValidationEnabled = true;

    const invalids: ICustomInput[] = attrs.filter((attr: any) => {
      let value = model[attr['fieldName']];

      if (!attr['isRequired'] && attr['type'] !== 'tree') return false;

      return value === null || value === undefined;
    });

    return invalids.length <= 0;
  }

  // validate case only because others are validated on section update
  public validate(): boolean {
    this.isValidationEnabled = true;
    const list: ICustomInput[] = Array.from(caseList);

    let invalids = list.filter((attr: any) => {
      if (!attr['isRequired'] && attr['type'] !== 'tree') return false;

      const value = this.values.get(attr['fieldName']);
      const isNull: boolean = value === null || value === undefined;

      if (attr['type'] === 'text') {
        return isNull || value === '';
      } else if (attr['type'] === 'tree') {
        console.log(this.attrService.flatTreeMap.get(value as number));
        return isNull || !this.attrService.flatTreeMap.get(value as number)?.leaf;
      }

      return isNull;
    });

    console.log(invalids);
    return invalids.length <= 0;
  }

  public getClientName(id: number): string {
    return this.clients.get(id)!.name;
  }

  public getCaseManagerName(id: number): string {
    return this.caseManagers.get(id)!.name;
  }

  public parseCase(iCase: any) {
    const item = _.cloneDeep(iCase);
    const keys: string[] = ['diagnoses', 'consultations', 'referrals', 'mental_symptoms', 'somatic_symptoms', 'other_symptoms'];
    item.case = this.parseSection(item.case) as MCaseMain;

    keys.forEach((key: string) => {
      if (item?.[key].length > 0) {
        if (key.includes('somatic') || key.includes('mental')) {
          item[key] = this.parseSymptoms(item[key]);
        } else {
          item[key] = item[key].map((item: IDiagnosis | IConsultation | IReferral) => this.parseSection(item));
        }
      }
    })

    return new MCase(item);
  }

  // set dropdown and treeselect option titles for case table ui and searching
  public parseSection(data: ICaseMain | IDiagnosis | IConsultation | IReferral | IMentalSymptom | ISomaticSymptom | IOtherSymptom) {
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

  // parseSymptoms for detailTable (mental/somatic Symptoms)
  public parseSymptoms(data: ISomaticSymptom[] | IMentalSymptom[]) {
    const groupedData = MSymptom.groupData(_.cloneDeep(data));

    return groupedData.map(([key, value]) => new MSymptom(key, value)).map((e: MSymptom) => {
      e.record_date = e.record_date;
      e.records = e.records.map((record: any) => this.parseSection(record));
      return e;
    })
  }

  // for Section Delete Click if caseID exists (referrals,diagnoses,consultations,otherSymptom)
  public getSectionDestroyMethod(sectionType: string) {
    return sectionType == 'diagnoses'
      ? 'destroyDiagnosis'
      : sectionType == 'referrals'
        ? 'destroyReferral'
        : sectionType == 'other_symptoms' ? 'destroyOtherSymptoms' : 'destroyConsultation';
  }

  // for Section Edit Click if caseID exists (referrals,diagnoses,consultations,otherSymptom)
  public getSectionUpdateMethod(sectionType: string) {
    return sectionType == 'diagnoses'
      ? 'updateDiagnosis'
      : sectionType == 'referrals'
        ? 'updateReferral'
        : sectionType == 'other_symptoms' ? 'updateOtherSymptoms' : 'updateConsultation';
  }

  // for Symptom Edit Click if caseID exists
  public getSymptomUpdateMethod(sectionType: string) {
    return sectionType == 'mental_symptoms'
      ? 'updateMentalSymptoms'
      : 'updateSomaticSymptoms';
  }

  // for Symptom Delete Click if caseID exists
  public getSymptomDestroyMethod(sectionType: string) {
    return sectionType == 'mental_symptoms'
      ? 'destroyMentalSymptoms'
      : 'destroySomaticSymptoms';
  }

  // Merge Symptoms to add/edit existing local data (if caseID doesn't exist)
  public mergeSymptoms(oldSymptoms: any[], newSymptoms: any[]) {
    return newSymptoms.reduce((result, item) => {
      const index = result.findIndex((oldItem: any) => oldItem.symptom_id === item.symptom_id && oldItem.record_date === item.record_date);
      if (index !== -1) {
        result[index] = item;
      } else {
        result.push(item);
      }
      return result;
    }, oldSymptoms);
  }

  // For Case Detail tables
  public isSymptomSection(sectionType: string): boolean {
    return sectionType === 'mental_symptoms' || sectionType === 'somatic_symptoms';
  }

  public isTreeSection(sectionType: string): boolean {
    return sectionType === 'forms_of_violences' || sectionType === 'care_plans';
  }

  private mapCaseResponse(data: APIResponse<any>): APIResponse<ParsedCases> {
    data.data = this.mapCases(data.data!) as ParsedCases;
    return data as APIResponse<ParsedCases>;
  }

  private mapClients(cache: any) {
    this.clients = new Map(cache);
    this.clients$.next(this.clients);
    this.clients$.complete();
  }

  private mapCaseManagers(cache: any) {
    this.caseManagers = new Map(cache);
    this.caseManagers$.next(this.caseManagers);
    this.caseManagers$.complete();
  }

  public caseList() {
    return Array.from(this.cases.values());
  }

  public parsedCaseList() {
    return Array.from(this.parsedCases.values());
  }
}
