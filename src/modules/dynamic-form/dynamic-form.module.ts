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
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { BrowserModule } from '@angular/platform-browser';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    TabViewModule,
    CardModule,
    FieldsetModule,
    ProgressBarModule,
    FormsModule,
    ButtonModule,
    MenuModule,
    InputTextModule,
    OverlayPanelModule,
    DividerModule,
    DynamicInputModule,
    NgxSpinnerModule
  ],
  exports: [
    DynamicFormComponent
  ],
  declarations: [DynamicFormComponent],
  providers: [DynamicDialogRef, DynamicDialogConfig]
})
export class DynamicFormModule { }
