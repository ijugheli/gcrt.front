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
import { ContextMenuModule } from 'primeng/contextmenu';
import { TreeTableModule } from 'primeng/treetable';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { InplaceModule } from 'primeng/inplace';
import { TableDisplayComponent } from './table-display/table-display.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableSettingsComponent } from './table-settings/table-settings.component';
import { TableFiltersComponent } from './table-filters/table-filters.component';

@NgModule({
  imports: [
    BrowserModule,
    InplaceModule,
    CommonModule,
    TableModule,
    FormsModule,
    TreeTableModule,
    // TreeTable
    DynamicDialogModule,
    MultiSelectModule,
    ContextMenuModule,
    ToggleButtonModule,
    OverlayPanelModule,
    InputSwitchModule,
    InputTextModule,
    DividerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    ChipModule,
    TagModule,
    ToastModule,
    NgxSpinnerModule
  ],
  providers: [ConfirmationService],
  exports: [DataTableComponent],
  declarations: [DataTableComponent, TableFiltersComponent, TableDisplayComponent, TableSettingsComponent, TableHeaderComponent],
})
export class DataTableModule { }
