import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { VIEW_TYPE_ID } from './app.config';
import { flattenTree, parseTree } from './app.func';
import { CaseService } from 'src/services/case.service';
import { AuthService } from 'src/services/AuthService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project';
  public isMenuVisible: boolean = true;

  constructor(private activatedRoute: ActivatedRoute, public attrService: AttributesService, public caseService: CaseService, public authService: AuthService) {
    this.authService.getToken();
    // Load data for app when user is authorized;
    this.authService.authStatus$.subscribe((isAuth) => {
      if (isAuth) {
        this.attrService.load();
        this.attrService.initSelectOptions();
        this.attrService.initTreeSelect();
        this.caseService.initCaseManagers();
        this.caseService.initClients();
        this.caseService.initSymptomOptions();
      }
    });
    this.authService.isMenuVisible$.subscribe((bool) => {
      this.isMenuVisible = bool;
    });
  }


}
