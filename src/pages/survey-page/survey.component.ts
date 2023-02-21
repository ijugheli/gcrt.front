// "node_modules/survey-core/modern.min.css"
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Model } from "survey-core";
import { json } from "./json";
import "./survey.component.css";
import "survey-core/defaultV2.min.css";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "component-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SurveyComponent implements OnInit {
  model!: Model;
  ngOnInit() {
    const survey = new Model(json);
    survey.onComplete.add((sender, options) => {
      console.log(JSON.stringify(sender.data, null, 3));
    });
    this.model = survey;
  }
}