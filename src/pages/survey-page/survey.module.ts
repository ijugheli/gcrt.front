import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { SurveyModule } from 'survey-angular-ui';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { FormsModule } from '@angular/forms';
@NgModule({
    declarations: [SurveyComponent],
    imports: [
        CommonModule,
        SurveyModule,
        NgxSpinnerModule,
        DividerModule,
        CardModule,
        FormsModule,
        TriStateCheckboxModule
    ]
})
export class SurveyPageModule { }