import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageObjectComponent } from './manage-object.component';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { DataTableModule } from '../data-table/data-table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DividerModule,
    DataTableModule,
    ListboxModule,
    PanelModule,
    ScrollPanelModule,
    DynamicFormModule
  ],
  exports: [ManageObjectComponent],
  declarations: [ManageObjectComponent]
})
export class ManageObjectModule {




}
