import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { storageItemExists } from 'src/app/app.func';
import { APIResponse, ISurveyMenuItem, ISurveyResult, } from 'src/app/app.interfaces';
import { GuardedService, } from '../app/app.models';
import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends GuardedService {
  public list: ISurveyMenuItem[] = [];
  public cacheKey: string = 'survey_menu_list';
  public urls: any = {
    'surveyList': API_URL + '/survey/list',
    'survey': API_URL + '/survey/{survey_id}',
    'store': API_URL + '/survey/store',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }

  public survey(attrID: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.urls['survey'].replace('{survey_id}', attrID), { headers: this.headers });
  }

  public store(data: any): Observable<any> {
    return this.http.post<APIResponse<ISurveyResult[]>>(this.urls['store'], data, { headers: this.headers });
  }

  public async getSurveyList(): Promise<ISurveyMenuItem[]> {
    if (this.hasCache()) {
      this.list = this.loadCache();
      return this.list;
    }

    const response = await firstValueFrom(this.http.post<APIResponse<ISurveyMenuItem[]>>(this.urls['surveyList'], { headers: this.headers }));

    this.saveCache(response.data!);
    this.list = response.data!;

    return this.list;
  }

  private saveCache(data: ISurveyMenuItem[]) {
    localStorage.setItem(this.cacheKey, JSON.stringify(data));
  }

  private loadCache(): ISurveyMenuItem[] {
    return JSON.parse(localStorage.getItem(this.cacheKey) as string) as ISurveyMenuItem[];
  }

  private hasCache(): boolean {
    return storageItemExists(this.cacheKey);
  }

}
