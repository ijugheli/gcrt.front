import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { APIResponse, IUserPermission } from 'src/app/app.interfaces';
import { GuardedService, User } from '../app/app.models';
import { AuthService } from './AuthService.service';
import { AttributesService } from './attributes/Attributes.service';
import { additionalMap } from 'src/pages/client/client-attrs/client.additional';
import { mainMap } from 'src/pages/client/client-attrs/client.main';
import { contactMap } from 'src/pages/client/client-attrs/client.contact';
import { addressMap } from 'src/pages/client/client-attrs/client.address';
import { Client } from 'src/pages/client/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GuardedService {
  public isValidationEnabled: boolean = false;
  public isInputDisabled: boolean = false;
  public values: Map<number | string, string | Date | null | boolean | number> = new Map();
  public clients: Map<number, Client> = new Map();
  public clientAttrs: Map<string, any> = new Map([...mainMap, ...additionalMap, ...contactMap, ...addressMap]);
  public urls: Record<string, string> = {
    'save': API_URL + '/client/save',
    'list': API_URL + '/client/list',
    'destroy': API_URL + '/client/destroy/{client_id}',
  };

  constructor(private http: HttpClient, private auth: AuthService, private attrService: AttributesService) {
    super(auth.getToken());
  }

  public save(data: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.urls['save'], data, { headers: this.headers });
  }

  public list(): Observable<APIResponse<Client[]>> {
    return this.http.get<APIResponse<Client[]>>(this.urls['list'], { headers: this.headers });
  }

  public destroy(clientID: number): Observable<APIResponse<Client[]>> {
    return this.http.delete<APIResponse<Client[]>>(this.urls['destroy'].replace('{client_id}', clientID.toString()), { headers: this.headers });
  }

  public validate(): boolean {
    this.isValidationEnabled = true;
    const list = Array.from(this.clientAttrs);

    let invalids = list.filter((attr: any) => {
      if (!attr['isRequired']) return false;

      return this.values.get(attr['fieldName']) === null || this.values.get(attr['fieldName']) === undefined;
    });

    return invalids.length <= 0;
  }

  /// For generating client code  Category(parent)/category_Group(child)/gender/age_group/repeatingClient/id
  public getClientCode(): string {
    let categoryGroupID: any = this.values.get('category_group_id') as number;
    const genderCode = this.attrService.dropdownOptions.get(this.values.get('gender') as number)?.value!.value;
    const ageGroup = this.attrService.dropdownOptions.get(this.values.get('age_group') as number)?.value!.value;
    const clientID = (this.values.get('client_id') as number);
    const repeating = (this.values.get('repeating_client') as boolean) ? 'მეორადი' : 'პირველადი';

    if (categoryGroupID != undefined) {
      categoryGroupID = this.getCategoryGroupTitle(categoryGroupID);
    }

    return (categoryGroupID || '') + this.concatClientCode([genderCode, ageGroup, repeating, clientID]);
  }

  // get parent category and its group title
  private getCategoryGroupTitle(id: number): string {
    const categoryGroup: any = this.attrService.flatTreeMap.get(id);
    const array: any[] = Array.from(this.attrService.flatTreeMap.values());
    const category: any = array.find(e => e.data.value_id == categoryGroup.data.p_value_id).data.title;
    return `[${category}][${categoryGroup.data.title}]`;
  }

  private concatClientCode(strings: any[]): string {
    let result = '';
    for (const string of strings) {
      if (string == undefined) {
        result += '';
      } else {
        result += '[' + string + ']'
      }
    }
    return result;
  }

  public mapClients(clients: Client[]): void {
    this.clients = new Map(clients.map(e => [e.main.id!, e as Client]));
  }
}
