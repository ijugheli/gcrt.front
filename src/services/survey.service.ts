import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/app.config';
import { storageItemExists } from 'src/app/app.func';
import { APIResponse, ISurveyResult, } from 'src/app/app.interfaces';
import { GuardedService, MSurvey, MSurveyMenuItem, } from '../app/app.models';
import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService extends GuardedService {
  public list!: MSurvey;
  public cacheKey: string = 'survey';
  public urls: any = {
    'surveyList': API_URL + '/survey/list',
    'survey': API_URL + '/survey/{survey_id}',
    'store': API_URL + '/survey/store',
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    super(auth.getToken());
  }


  public store(data: any): Observable<any> {
    return this.http.post<APIResponse<ISurveyResult[]>>(this.urls['store'], data, { headers: this.headers });
  }

  public getSurveyList(): Observable<MSurvey> {
    if (this.hasCache()) {
      return this.loadCache();
    }

    return this.http.get(this.urls['surveyList'], { headers: this.headers }).pipe(map((d: any) => {
      this.saveCache(d.data);
      return this.list;
    }));
  }

  private saveCache(response: any) {
    this.parseSurveys(response);
    console.log(this.list);
    localStorage.setItem(this.cacheKey, JSON.stringify(response));
  }

  private loadCache(): Observable<MSurvey> {
    return new Observable<MSurvey>((subscriber) => {
      if (this.list != null) {
        subscriber.next(this.list);
        subscriber.complete();
        return;
      }

      const survey = JSON.parse(localStorage.getItem(this.cacheKey) as string);
      subscriber.next(this.parseSurveys(survey));
      subscriber.complete();
    });
  }

  private hasCache(): boolean {
    return storageItemExists(this.cacheKey);
  }

  private parseSurveys(data: any) {
    const surveys = new Map();
    const items: MSurveyMenuItem[] = [];

    for (let item of data) {
      items.push(new MSurveyMenuItem(item));
      surveys.set(item.surveyID, item);
    }

    this.list = new MSurvey(items, surveys);
    return this.list;
  }

}
