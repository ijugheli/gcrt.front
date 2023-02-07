import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeFormComponent } from './attribute-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressBarModule } from 'primeng/progressbar';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DividerModule } from 'primeng/divider';
import { DynamicInputModule } from 'src/modules/dynamic-input/dynamic-input.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';
import { PanelModule } from 'primeng/panel';
import {SplitterModule} from 'primeng/splitter';
import {ListboxModule} from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { ManageObjectModule } from 'src/modules/manage-object/manage-object.module';
import { ManageObjectComponent } from '../../modules/manage-object/manage-object.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    CardModule,
    FieldsetModule,
    ProgressBarModule,
    DataTableModule,
    ButtonModule,
    MenuModule,
    OverlayPanelModule,
    DividerModule,
    DynamicInputModule,
    NgxSpinnerModule,
    DynamicFormModule,
    ListboxModule,
    PanelModule,
    ScrollPanelModule,
    SplitterModule,
    ManageObjectModule
  ],
  declarations: [AttributeFormComponent]
})
export class AttributeFormModule { }
