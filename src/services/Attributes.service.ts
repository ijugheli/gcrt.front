import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Attribute, GuardedService } from 'src/app/app.models';
import { AuthService } from './AuthService.service';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AttributesService extends GuardedService {
  // public urls: any = {
  //   'list': 'https://gcrt.live/api/attrs/',
  //   'details': 'https://gcrt.live/api/attrs/{attr_id}',
  //   'full': 'https://gcrt.live/api/attrs/{attr_id}/values',
  //   'addValueCollection': 'https://gcrt.live/api/attrs/{attr_id}/values/add',
  //   'delete': 'https://gcrt.live/api/attrs/{attr_id}/values/remove',
  // };

  public urls: any = {
    'list': 'http://localhost:8000/attrs/',
    'details': 'http://localhost:8000/attrs/{attr_id}',
    'full': 'http://localhost:8000/attrs/{attr_id}/values',
    'addValueCollection': 'http://localhost:8000/attrs/{attr_id}/values/add',
    'delete': 'http://localhost:8000/attrs/{attr_id}/values/remove',
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

  public full(attrID: number) {
    return this.http.get<Attribute[]>(this.urls['full'].replace('{attr_id}', attrID.toString()), { headers: this.headers });
  }

  public attribute(attrID: number) {
    return this.http.get<Attribute>(this.urls['details'].replace('{attr_id}', attrID.toString()), { headers: this.headers });
  }

  public addValueCollection(attrID: number, values: any) {
    return this.http.post(this.urls['addValueCollection'].replace('{attr_id}', attrID.toString()), values, { headers: this.headers });
  }
}
