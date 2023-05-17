import { Component, OnInit } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { CaseService } from 'src/services/case.service';
import { AuthService } from 'src/services/AuthService.service';
import { SurveyService } from 'src/services/survey.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project';

  constructor(
    public attrService: AttributesService,
    public caseService: CaseService,
    public authService: AuthService,
    public surveyService: SurveyService,
    public userService: UserService
  ) {

  }

  ngOnInit() {

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
  }
}
