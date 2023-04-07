import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientComponent } from './client.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';

@NgModule({
    declarations: [ClientComponent, ClientFormComponent],
    imports: [
        ButtonModule,
        CalendarModule,
        CommonModule,
        ConfirmDialogModule,
        DropdownModule,
        DividerModule,
        InputSwitchModule,
        InputMaskModule,
        InputTextModule,
        InputTextareaModule,
        ToastModule,
        TableModule,
        TreeSelectModule,
        SelectButtonModule,
        FormsModule,
        KeyFilterModule
    ]
})

export class ClientModule { }