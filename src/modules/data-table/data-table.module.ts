import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule, } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';

import { InputSwitchModule } from 'primeng/inputswitch';

import { ToggleButtonModule } from 'primeng/togglebutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';


@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    DynamicDialogModule,
    MultiSelectModule,
    ToggleButtonModule,
    OverlayPanelModule,
    DynamicFormModule,
    InputSwitchModule,
    DividerModule,
    ConfirmDialogModule,
    ChipModule,
    TagModule,
    ToastModule,
    NgxSpinnerModule
  ],
  providers: [ConfirmationService],
  exports: [DataTableComponent],
  declarations: [DataTableComponent],
})
export class DataTableModule { }
