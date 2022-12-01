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
import { DataTableModule } from '../data-table/data-table.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    CardModule,
    FieldsetModule,
    ProgressBarModule,
    DataTableModule,
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
  declarations: [DynamicFormComponent]
})
export class DynamicFormModule { }
