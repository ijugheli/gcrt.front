import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { TabViewModule} from 'primeng/tabview';
import { FieldsetModule} from 'primeng/fieldset';
import { DynamicInputModule } from 'src/modules/dynamic-input/dynamic-input.module';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    TabViewModule,
    FieldsetModule,
    DataTableModule,
    DynamicInputModule,
    DynamicFormModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
