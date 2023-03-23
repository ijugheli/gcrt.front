import { Component, OnInit } from "@angular/core";
import { Model } from "survey-core";
import "./survey.component.css";
import "survey-core/defaultV2.min.css";
import { SurveyService } from "src/services/survey.service";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ISymptomSurveyResult } from "src/app/app.interfaces";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "component-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.css"],
})

export class SurveyComponent implements OnInit {
  public model!: Model;
  public surveyID!: number;
  public resultData: ISymptomSurveyResult[] = [];

  constructor(
    public spinner: NgxSpinnerService,
    private surveyService: SurveyService,
    private activatedRoute: ActivatedRoute,
  ) { };

  ngOnInit() {
    this.spinner.show();
    this.init();
  }

  private init() {
    this.surveyID = parseInt(this.activatedRoute.snapshot.paramMap.get('survey_id')!);

    const that = this;
    this.surveyService.survey(this.surveyID).subscribe((data) => {
      const survey = new Model(data.data);
      survey.showCompletedPage = false;

      survey.onComplete.add((sender, options) => {
        // that.surveyService.store(sender.data).subscribe((data) => {
        //   this.resultData = data.data;
        // });
        console.log(sender.getPlainData());
        survey.clear(false, true);
      });
      survey.onValueChanged.add((sender, options) => {
        that.surveyService.store(sender.data).subscribe((data) => {
          this.resultData = data.data;
        });
        
        survey.clear(false, true);
      });

      this.model = survey;
      this.spinner.hide();
    });
  }
}