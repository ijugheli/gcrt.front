import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from '../cache.service';
import { AttributesService } from '../attributes/Attributes.service';
import { CaseService } from '../case.service';
import { AuthService } from '../AuthService.service';
import { SurveyService } from '../survey.service';
import { UserService } from '../user.service';
import { MenuService } from './menu.service';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class AppService {
    public carePlanTree: any[] = [];
    public formsOfViolenceTree: any[] = [];
    // dropdown options for case manager and client 


    constructor(
        private attrService: AttributesService,
        private caseService: CaseService,
        private authService: AuthService,
        private menuService: MenuService,
        private router: Router
    ) { }

    public init(): void {
        this.authService.getToken();
        this.authService.authStatus$.subscribe((isAuth) => {
            if (isAuth) {
                this.attrService.load();
                this.attrService.initSelectOptions();
                this.attrService.initTreeSelect();
                this.caseService.initCaseManagers();
                this.caseService.initClients();
                this.caseService.initSymptomOptions();
            } else {
                this.menuService.hideMenu();
                this.router.navigate(['login'], { replaceUrl: true })
            }
        });
    }
}
