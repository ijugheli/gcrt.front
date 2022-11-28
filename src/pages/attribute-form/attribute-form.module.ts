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

@NgModule({
  imports: [
    CommonModule,
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
    NgxSpinnerModule
  ],
  declarations: [AttributeFormComponent]
})
export class AttributeFormModule { }
