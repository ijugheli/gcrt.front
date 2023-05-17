import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from '../cache.service';
import { AttributesService } from '../attributes/Attributes.service';


@Injectable({
    providedIn: 'root',
})
export class AppService {
    public carePlanTree: any[] = [];
    public formsOfViolenceTree: any[] = [];
    // dropdown options for case manager and client 


    constructor(private http: HttpClient, private cacheService: CacheService, private attrService: AttributesService) {

    }
}
