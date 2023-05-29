import { Component, OnInit } from "@angular/core";
import { Model } from "survey-core";
import { SurveyService } from "src/services/survey.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ISurveyResult } from "src/app/app.interfaces";
import { getRouteParam } from "src/app/app.func";
import { MenuService } from "src/services/app/menu.service";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "component-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"],
})

export class SurveyComponent implements OnInit {
  public model!: Model;
  public surveyID: number = parseInt(getRouteParam('survey_id'));
  public resultData: ISurveyResult[] = [];

  constructor(
    public spinner: NgxSpinnerService,
    private surveyService: SurveyService,
    public menuService: MenuService
  ) { };

  ngOnInit() {
    this.spinner.show();
    this.init();
  }



  private init() {
    const that = this;
    this.surveyService.getSurveyList().subscribe((data) => {
      const survey = new Model(data.surveys.get(this.surveyID));
      survey.showCompletedPage = false;

      survey.onComplete.add((sender: any, options: any) => {
        that.surveyService.store({ surveyID: this.surveyID, data: sender.data }).subscribe((data) => {
          this.resultData = data.data;
        });
        survey.clear(false, true);
      });

      if (this.surveyID != 7) {
        survey.onValueChanged.add((sender: any, options: any) => {
          that.surveyService.store({ surveyID: this.surveyID, data: sender.data }).subscribe((data) => {
            this.resultData = data.data;
          });

          survey.clear(false, true);
        });
      }

      this.model = survey;
      this.spinner.hide();
    });
  }
}