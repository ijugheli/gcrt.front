import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributePageComponent } from './attribute-page.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { MenuModule } from 'src/modules/menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    MenuModule,
    DataTableModule,
  ],
  exports: [
    AttributePageComponent
  ],
  declarations: [AttributePageComponent]
})
export class AttributePageModule { }
