// "node_modules/survey-core/modern.min.css"
import { Component, OnInit } from "@angular/core";
import { Model } from "survey-core";
import "./survey.component.css";
import "survey-core/defaultV2.min.css";
import { SurveyService } from "src/services/survey.service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "component-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.css"],
})
export class SurveyComponent implements OnInit {
  model!: Model;
  constructor(
    public spinner: NgxSpinnerService,
    private surveyService: SurveyService,
  ) { };

  ngOnInit() {
    this.spinner.show();
    this.init();
  }

  private init() {
    const that = this;
    this.surveyService.survey(48).subscribe((data) => {
      const survey = new Model({ elements: data.elements });

      survey.onComplete.add((sender, options) => {
        that.surveyService.store(sender.data).subscribe((data) => {
          console.log(data);
        });
      });

      this.model = survey;
      this.spinner.hide();
    });
  }
}