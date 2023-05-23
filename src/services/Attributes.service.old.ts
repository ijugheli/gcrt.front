import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Attribute, GuardedService } from 'src/app/app.models';
import { AuthService } from './AuthService.service';
import { ThisReceiver } from '@angular/compiler';
import { API_URL } from '../app/app.config';

@Injectable({
  providedIn: 'root'
})
export class AttributesService  {

  public urls: any = {
    'list': API_URL + '/attrs/',
    'withProperties': API_URL + '/attrs/{attr_id}',
    'withValue': API_URL + '/attrs/{attr_id}/values/{value_id}',
    'full': API_URL + '/attrs/{attr_id}/values',
    'related': API_URL + '/attrs/{attr_id}/related/{value_id}',
    'tree': API_URL + '/attrs/{attr_id}/values/tree/{value_id}',
    'title': API_URL + '/attrs/{attr_id}/title',
    'addValueCollection': API_URL + '/attrs/{attr_id}/values/add',
    'editValueCollection': API_URL + '/attrs/{attr_id}/values/{value_id}/edit',
    'delete': API_URL + '/attrs/{attr_id}/values/remove',
    'editValueItem': API_URL + '/attrs/values/edit',
  };


  private attrs : any;

  constructor(private http: HttpClient, ) {
    console.log('Service Generated');
    
    this.load();
  }

  private load() {
    this.http.get(this.urls['list'], ).subscribe((d) => {
      console.log(d);
    }, (e) => {

    });
  }
















  // Individual Requests

  public list() {
    return this.http.get<Attribute[]>(this.urls['list'], );
  }

  public delete(attrID: number, values: any) {
    return this.http.post(this.urls['delete'].replace('{attr_id}', attrID.toString()), values, );
  }

  public related(attrID: number, valueID: number) {
    console.log('VALUE IS');
    console.log(valueID);
    console.log('VALUE IS');
    return this.http.get<Attribute[]>(this.urls['related'].replace('{attr_id}', attrID.toString()).replace('{value_id}', valueID.toString()), );
  }

  public full(attrID: number) {
    return this.http.get<Attribute[]>(this.urls['full'].replace('{attr_id}', attrID.toString()), );
  }

  public attribute(attrID: number) {
    return this.http.get<Attribute>(this.urls['withProperties'].replace('{attr_id}', attrID.toString()), );
  }

  public attributeWithValue(attrID: number, valueID: number) {
    return this.http.get<Attribute>(this.urls['withValue']
      .replace('{attr_id}', attrID.toString())
      .replace('{value_id}', valueID), 
    );
  }

  public treeNodes(attrID: number, valueID: number) {
    return this.http.get<Attribute>(this.urls['tree']
      .replace('{attr_id}', attrID.toString())
      .replace('{value_id}', valueID.toString()), 
    );
  }

  public addValueCollection(attrID: number, values: any) {
    return this.http.post(this.urls['addValueCollection'].replace('{attr_id}', attrID.toString()), values, );
  }

  public setTitle(attrID: number, values: any) {
    return this.http.post(this.urls['title'].replace('{attr_id}', attrID.toString()), values, );
  }

  public editValueCollection(attrID: number, valueID: number, values: any) {
    return this.http.post(this.urls['editValueCollection']
      .replace('{attr_id}', attrID.toString())
      .replace('{value_id}', valueID.toString()), values, );
  }

  public editValueItem(values: any) {
    return this.http.post(this.urls['editValueItem'], values, );
  }

}
