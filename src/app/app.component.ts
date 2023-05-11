import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { VIEW_TYPE_ID } from './app.config';
import { flattenTree, parseTree } from './app.func';
import { CaseService } from 'src/services/case.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project';
  public menuExists: boolean = true;
  private pages: string[] = [
    'login',
    'forgot-password',
    'update-password',
    'otp'
  ];

  constructor(private activatedRoute: ActivatedRoute, public attrService: AttributesService, public caseService: CaseService) {
    this.attrService.initSelectOptions();

    this.attrService.initTreeSelect();

    this.caseService.initCaseManagers();
    this.caseService.initClients();
    this.caseService.initSymptomOptions();

    const url = window.location.href.toString();

    console.log(activatedRoute.snapshot);

    if (this.pages.some((page) => url.indexOf(page) > - 1)) {
      this.menuExists = false;
    }

  }
}
