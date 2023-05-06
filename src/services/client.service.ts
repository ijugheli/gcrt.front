import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
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
import { IClient, MClient, MClientAdditional, MClientAddress, MClientMain, ParsedClients, checkClientKeys } from 'src/pages/client/client.model';
import { MCase } from 'src/pages/case/case.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends GuardedService {
  public isValidationEnabled: boolean = false;
  public isInputDisabled: boolean = false;
  public values: Map<number | string, string | Date | null | boolean | number> = new Map();
  public clients: Map<number, IClient> = new Map();
  public parsedClients: Map<number, MClient> = new Map();
  public clientAttrs: Map<string, any> = new Map([...mainMap, ...additionalMap, ...contactMap, ...addressMap]);
  public urls: Record<string, string> = {
    'store': API_URL + '/client/store',
    'index': API_URL + '/client/index',
    'show': API_URL + '/client/show/{id}',
    'destroy': API_URL + '/client/destroy/{id}',
  };

  constructor(private http: HttpClient, private auth: AuthService, private attrService: AttributesService) {
    super(auth.getToken());
  }

  public store(data: any): Observable<APIResponse<IClient>> {
    return this.http.post<APIResponse<IClient>>(this.urls['store'], data, { headers: this.headers });
  }

  public index(): Observable<APIResponse<ParsedClients>> {
    return this.http.get<APIResponse<any>>(this.urls['index'], { headers: this.headers }).pipe(map(data => this.mapClientResponse(data)));
  }

  public show(clientID: number): Observable<APIResponse<IClient>> {
    return this.http.get<APIResponse<IClient>>(this.urls['show'].replace('{id}', clientID.toString()), { headers: this.headers });
  }

  public destroy(clientID: number): Observable<APIResponse<ParsedClients>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroy'].replace('{id}', clientID.toString()), { headers: this.headers }).pipe(map(data => this.mapClientResponse(data)));
  }

  public validate(): boolean {
    this.isValidationEnabled = true;
    const list = Array.from(this.clientAttrs.values());

    let invalids = list.filter((attr: any) => {
      if (!attr['isRequired']) return false;

      const value = this.values.get(attr['fieldName']);

      if (attr['type'] === 'text') {
        return value === null || value === undefined || value === '';
      }

      return value === null || value === undefined;
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

    if (categoryGroupID) {
      categoryGroupID = this.getCategoryGroupTitle(categoryGroupID);
    }

    return (categoryGroupID || '') + this.concatClientCode([genderCode, ageGroup, repeating, clientID]);
  }

  // get parent category and its group title
  private getCategoryGroupTitle(id: number): string {
    const categoryGroup: any = this.attrService.flatTreeMap.get(id);
    const array: any[] = Array.from(this.attrService.flatTreeMap.values());
    const category: any = array.find(e => e.data.value_id == categoryGroup.data.p_value_id)?.data.title;

    // if parent doesnt exist
    if (!categoryGroup.data.p_value_id) {
      return `[${categoryGroup.data.title}]`;
    }

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

  public mapClients(clients: IClient[]): ParsedClients {
    this.parsedClients = new Map();
    this.clients = new Map(clients.map(e => {
      this.parsedClients.set(e.main.id!, this.parseClient(e))
      return [e.main.id!, e as IClient];
    }));

    return { clients: this.clientList(), parsedClients: this.parsedClientList() };
  }

  public clientList(): IClient[] {
    return Array.from(this.clients.values());
  }

  public parsedClientList(): MClient[] {
    return Array.from(this.parsedClients.values());
  }

  private mapClientResponse(data: APIResponse<any>): APIResponse<ParsedClients> {
    data.data = this.mapClients(data.data!) as ParsedClients;
    return data as APIResponse<ParsedClients>;
  }

  private parseClient(client: any) {
    const item = Object.assign({}, client);

    Object.keys(client).forEach(key => {
      item[key] = this.parseSection(item[key]);
    });

    return item as MClient;
  }

  // set dropdown and treeselect option titles for client table ui and searching
  private parseSection(client: IClient): any {
    return Object.entries(client).reduce((item: any, [key, value]: [string, any]) => {
      if (checkClientKeys(key)) {
        item[key] = this.attrService.getOptionTitle(value);
      } else {
        item[key] = value;
      }
      return item;
    }, {});
  }
}
