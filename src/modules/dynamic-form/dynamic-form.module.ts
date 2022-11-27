import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form.component';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { DynamicInputModule } from 'src/modules/dynamic-input/dynamic-input.module';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgxSpinnerModule } from "ngx-spinner";
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    TabViewModule,
    CardModule,
    FieldsetModule,
    ProgressBarModule,
    ButtonModule,
    MenuModule,
    DividerModule,
    DynamicInputModule,
    NgxSpinnerModule
  ],
  exports: [
    DynamicFormComponent
  ],
  declarations: [DynamicFormComponent]
})
export class DynamicFormModule { }
