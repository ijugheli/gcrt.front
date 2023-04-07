import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { CaseFormComponent } from './case-form.component';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CalendarModule } from 'primeng/calendar';
import { TreeSelectModule } from 'primeng/treeselect';
@NgModule({
    declarations: [CaseFormComponent],
    imports: [
        CommonModule,
        DividerModule,
        BrowserAnimationsModule,
        FormsModule,
        InputSwitchModule,
        TreeSelectModule,
        ButtonModule,
        SelectButtonModule,
        CalendarModule,
        DropdownModule,
        ToastModule,
        ReactiveFormsModule,
        KeyFilterModule,
        ConfirmDialogModule,
        DropdownModule,
        InputTextModule,
        FieldsetModule,
        NgxSpinnerModule,
        MenuModule,
        CardModule,
        InputMaskModule,
        TabViewModule,
        InputSwitchModule,
        PanelModule,
    ]
})

export class CaseFormModule { }