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

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    DynamicDialogModule,
    MultiSelectModule,
    DynamicFormModule,
    ConfirmDialogModule,
    ToastModule,
    NgxSpinnerModule
  ],
  providers: [ConfirmationService],
  exports: [DataTableComponent],
  declarations: [DataTableComponent],
})
export class DataTableModule { }
