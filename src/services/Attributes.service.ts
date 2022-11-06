import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Attribute } from 'src/app/app.models';


@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  public url: string = 'http://localhost:8000/attrs/';
  // public urls: any = {
  //   'list': 'http://localhost:8000/attrs/',
  //   'details': 'http://localhost:8000/attrs/{attr_id}',
  //   'full': 'http://localhost:8000/attrs/{attr_id}/values',
  //   'addValueCollection': 'http://localhost:8000/attrs/{attr_id}/values/add',
  //   'delete': 'http://localhost:8000/attrs/{attr_id}/values/remove',
  // };

  public urls: any = {
    'list': 'https://gcrt.live/api/attrs/',
    'details': 'https://gcrt.live/api/attrs/{attr_id}',
    'full': 'https://gcrt.live/api/attrs/{attr_id}/values',
    'addValueCollection': 'https://gcrt.live/api/attrs/{attr_id}/values/add',
    'delete': 'https://gcrt.live/api/attrs/{attr_id}/values/remove',
  };

  constructor(private http: HttpClient) { }

  public list() {
    return this.http.get<Attribute[]>(this.urls['list']);
  }

  public delete(attrID: number, values: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
// return this.httpClient.post<T>(this.httpUtilService.prepareUrlForRequest(url), body, {headers: headers})
    return this.http.post(this.urls['delete'].replace('{attr_id}', attrID.toString()), values, {headers : headers});
  }

  public full(attrID: number) {
    return this.http.get<Attribute[]>(this.urls['full'].replace('{attr_id}', attrID.toString()));
  }

  public attribute(attrID: number) {
    return this.http.get<Attribute>(this.urls['details'].replace('{attr_id}', attrID.toString()));
  }

  public addValueCollection(attrID: number, values: any) {
    return this.http.post(this.urls['addValueCollection'].replace('{attr_id}', attrID.toString()), values);
  }

}
