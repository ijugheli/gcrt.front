import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { MenuModule } from 'src/modules/menu/menu.module';
import { StyleClassModule } from 'primeng/styleclass';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { UserReportComponent } from './users/user-report.component';
@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule,
    DividerModule,
    StyleClassModule,
    MenuModule,
    CheckboxModule,
  ],
  declarations: [ReportsComponent, UserReportComponent]
})
export class ReportsModule { }
