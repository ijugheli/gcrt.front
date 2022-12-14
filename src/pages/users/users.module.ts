import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { DataTableModule } from 'src/modules/data-table/data-table.module';
import { MenuModule } from 'src/modules/menu/menu.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    MenuModule,
    ConfirmDialogModule,
    TableModule,
    FormsModule,
    ToastModule,
    NgxSpinnerModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [ConfirmationService],
  declarations: [UsersComponent]
})
export class UsersModule { }
