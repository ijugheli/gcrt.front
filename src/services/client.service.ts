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
export class ClientService {
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

  constructor(private http: HttpClient, private attrService: AttributesService) {
  }

  public store(data: any): Observable<APIResponse<IClient>> {
    return this.http.post<APIResponse<IClient>>(this.urls['store'], data,);
  }

  public index(): Observable<APIResponse<ParsedClients>> {
    return this.http.get<APIResponse<any>>(this.urls['index'],).pipe(map(data => this.mapClientResponse(data)));
  }

  public show(clientID: number): Observable<APIResponse<IClient>> {
    return this.http.get<APIResponse<IClient>>(this.urls['show'].replace('{id}', clientID.toString()),);
  }

  public destroy(clientID: number): Observable<APIResponse<ParsedClients>> {
    return this.http.delete<APIResponse<any>>(this.urls['destroy'].replace('{id}', clientID.toString()),).pipe(map(data => this.mapClientResponse(data)));
  }

  public validate(): boolean {
    this.isValidationEnabled = true;
    const list = Array.from(this.clientAttrs.values());

    let invalids = list.filter((attr: any) => {
      if (!attr['isRequired']) return false;

      const value = this.values.get(attr['fieldName']);
      const isNull: boolean = value === null || value === undefined;

      if (attr['type'] === 'text') {
        if (attr['fieldName'] === 'gender_field') {
          const gender = this.values.get('gender') as number;
          if (gender === undefined) {
            return false;
          }
          return this.attrService.getOptionTitle(gender as number)?.includes('სხვა') ? (isNull || value === '') : false;
        }

        return isNull || value === '';
      } else if (attr['type'] === 'tree') {
        return isNull || !this.attrService.flatTreeMap.get(value as number)?.leaf;
      }

      return isNull;
    });
    return invalids.length <= 0;
  }


  /// For generating client code  Client_group/client_subgroup/sex+ ageGroup(other)/age_group/client_type/id
  public getClientCode(): string {
    const code = ['client_group', 'client_subgroup', `[${this.getOptionCode('sex')}${this.getAgeGroup()}]`, 'age_group', 'client_type', `[${this.values.get('client_id')}]`]
      .map(key => {
        if (key.includes('undefined')) return '';
        return key.includes('[') ? key : this.formatClientCode(key);
      });

    return code.join('');
  }

  public mapClients(clients: IClient[]): ParsedClients {
    this.parsedClients = new Map();
    this.clients = new Map(clients.map(e => {
      const client: IClient = new IClient(e);
      this.parsedClients.set(e.main.id!, this.parseClient(client))
      return [e.main.id!, client];
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

  private getAgeGroup(): string {
    const age = this.values.get('age') as number;
    if (age === undefined) return '';

    return (age as number) >= 18 ? 'b' : 'a';
  }
  private formatClientCode(key: string): string {
    return `[${this.getOptionCode(key) ?? ''}]`;
  }

  private getOptionCode(key: string) {
    return this.attrService.dropdownOptions.get(this.values.get(key) as number)?.value?.value ?? '';
  }

}
