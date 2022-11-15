import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { MenuModule } from 'src/modules/menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    MenuModule,
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
