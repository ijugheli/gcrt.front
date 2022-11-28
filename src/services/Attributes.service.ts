import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Attribute, GuardedService } from 'src/app/app.models';
import { AuthService } from './AuthService.service';
import { ThisReceiver } from '@angular/compiler';
import { API_URL } from '../app/app.config';

@Injectable({
  providedIn: 'root'
})
export class AttributesService extends GuardedService {

  public urls: any = {
    'list': API_URL + '/attrs/',
    'withProperties': API_URL + '/attrs/{attr_id}',
    'withValue': API_URL + '/attrs/{attr_id}/values/{value_id}',
    'full': API_URL + '/attrs/{attr_id}/values',
    'related': API_URL + '/attrs/{attr_id}/related/{value_id}',
    'addValueCollection': API_URL + '/attrs/{attr_id}/values/add',
    'editValueCollection': API_URL + '/attrs/{attr_id}/values/{value_id}/edit',
    'delete': API_URL + '/attrs/{attr_id}/values/remove',
    'editValueItem': API_URL + '/attrs/values/edit',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public list() {
    return this.http.get<Attribute[]>(this.urls['list'], { headers: this.headers });
  }

  public delete(attrID: number, values: any) {
    return this.http.post(this.urls['delete'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
  }

  public related(attrID: number, valueID: number) {
    console.log('VALUE IS');
    console.log(valueID);
    console.log('VALUE IS');
    return this.http.get<Attribute[]>(this.urls['related'].replace('{attr_id}', attrID.toString()).replace('{value_id}', valueID.toString()), { headers: this.headers });
  }

  public full(attrID: number) {
    return this.http.get<Attribute[]>(this.urls['full'].replace('{attr_id}', attrID.toString()), { headers: this.headers });
  }

  public attribute(attrID: number) {
    return this.http.get<Attribute>(this.urls['withProperties'].replace('{attr_id}', attrID.toString()), { headers: this.headers });
  }

  public attributeWithValue(attrID: number, valueID: number) {
    return this.http.get<Attribute>(this.urls['withValue']
      .replace('{attr_id}', attrID.toString())
      .replace('{value_id}', valueID), { headers: this.headers }
    );
  }

  public addValueCollection(attrID: number, values: any) {
    return this.http.post(this.urls['addValueCollection'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
  }

  public editValueCollection(attrID: number, valueID: number, values: any) {
    return this.http.post(this.urls['editValueCollection']
      .replace('{attr_id}', attrID.toString())
      .replace('{value_id}', valueID.toString()), values, { headers: this.headers });
  }

  public editValueItem(values: any) {
    return this.http.post(this.urls['editValueItem'], values, { headers: this.headers });
  }

}
