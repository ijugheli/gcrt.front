import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    PanelModule,
    NgxSpinnerModule,
    ToastModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    FormsModule
  ],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
