import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyComponent } from './survey.component';
import { SurveyModule } from 'survey-angular-ui';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { TableModule } from 'primeng/table';
import { Card, CardModule } from 'primeng/card';
import { Divider, DividerModule } from 'primeng/divider';
@NgModule({
    declarations: [SurveyComponent],
    imports: [
        CommonModule,
        SurveyModule,
        NgxSpinnerModule,
        DataTableModule,
        DividerModule,
        CardModule,
        TableModule,
    ]
})
export class SurveyPageModule { }