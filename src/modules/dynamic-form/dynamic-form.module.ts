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

@NgModule({
  imports: [
    CommonModule,
    TabViewModule,
    FieldsetModule,
    ProgressBarModule,
    ButtonModule,
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
