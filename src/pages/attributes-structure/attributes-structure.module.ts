import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesStructureComponent } from './attributes-structure.component';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
    InputSwitchModule,
    ButtonModule,
    DropdownModule
  ],
  declarations: [AttributesStructureComponent]
})
export class AttributesStructureModule { }