import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesStructureComponent } from './attributes-structure.component';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
  ],
  declarations: [AttributesStructureComponent]
})
export class AttributesStructureModule { }
