import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AddAttributeComponent } from './add-attribute/add-attribute.component';
import { AddSectionComponent } from './add-section/add-section.component';
import { AttributesStructureComponent } from './attributes-structure.component';
import { AddSectionPropertyComponent } from './add-section-property/add-section-property.component';

@NgModule({
    declarations: [AttributesStructureComponent, AddAttributeComponent, AddSectionComponent, AddSectionPropertyComponent],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        InputSwitchModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DropdownModule,
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