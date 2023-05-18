import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientComponent } from './client.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ClientComponent, ClientFormComponent],
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DividerModule,
        InputMaskModule,
        CustomInputComponent,
        ToastModule,
        TableModule,
        SelectButtonModule,
        InputSwitchModule,
        FormsModule,
        SkeletonModule,
        RouterModule
    ]
})

export class ClientModule { }