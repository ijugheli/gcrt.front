import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesStructureComponent } from './attributes-structure.component';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DataTableModule } from "../../modules/data-table/data-table.module";
import { ToastModule } from 'primeng/toast';
@NgModule({
    declarations: [AttributesStructureComponent],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        TableModule,
        FormsModule,
        InputSwitchModule,
        ButtonModule,
        ToastModule,
        DropdownModule,
        DataTableModule
    ]
})
export class AttributesStructureModule { }