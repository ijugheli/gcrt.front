import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributePageComponent } from './attribute-page.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
  ],
  exports: [
    AttributePageComponent
  ],
  declarations: [AttributePageComponent]
})
export class AttributePageModule { }
