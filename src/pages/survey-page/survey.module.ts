import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SurveyComponent } from './survey.component';
import { SurveyModule } from 'survey-angular-ui';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [SurveyComponent],
    imports: [
        CommonModule,
        SurveyModule,
        NgxSpinnerModule,
    ]
})
export class SurveyPageModule { }