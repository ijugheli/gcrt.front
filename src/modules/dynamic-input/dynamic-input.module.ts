import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicInputComponent } from './dynamic-input.component';

import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {TreeSelectModule} from 'primeng/treeselect';

@NgModule({
  imports: [
    CommonModule,
    MultiSelectModule,
    EditorModule,
    FormsModule,
    InputTextModule,
    TreeSelectModule,
    InputSwitchModule,
    InputNumberModule,
    DropdownModule,
    AccordionModule,
    CalendarModule
  ],
  exports: [
    DynamicInputComponent
  ],
  declarations: [DynamicInputComponent]
})
export class DynamicInputModule { }
