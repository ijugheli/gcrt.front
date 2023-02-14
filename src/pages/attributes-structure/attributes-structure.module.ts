import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributesStructureComponent } from './attributes-structure.component';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DataTableModule } from "../../modules/data-table/data-table.module";
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddAttributeComponent } from './add-attribute/add-attribute.component';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { PanelModule } from 'primeng/panel';
import { AddSectionComponent } from './add-section/add-section.component';
import { AddSectionPropertyComponent } from './add-section-property/add-section-property.component';

@NgModule({
    declarations: [AttributesStructureComponent, AddAttributeComponent, AddSectionComponent, AddSectionPropertyComponent],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        TableModule,
        FormsModule,
        InputSwitchModule,
        ButtonModule,
        ToastModule,
        ReactiveFormsModule,
        DropdownModule,
        DataTableModule,
        InputTextModule,
        FieldsetModule,
        NgxSpinnerModule,
        MenuModule,
        DividerModule,
        CardModule,
        InputMaskModule,
        PanelModule,
    ]
})

export class AttributesStructureModule { }