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
import { DropdownModule } from 'primeng/dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import { PlainInputComponent } from './plain-input/plain-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { SwitchInputComponent } from './switch-input/switch-input.component';
import { MultiselectInputComponent } from './multiselect-input/multiselect-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { TreeselectInputComponent } from './treeselect-input/treeselect-input.component';

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
    PlainInputComponent,
    DropdownModule,
    AccordionModule,
    CalendarModule,
    SelectInputComponent,
    SwitchInputComponent,
    MultiselectInputComponent,
    DateInputComponent,
    TreeselectInputComponent
  ],
  exports: [
    DynamicInputComponent
  ],
  declarations: [DynamicInputComponent]
})
export class DynamicInputModule { }
