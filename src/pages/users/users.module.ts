import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { MenuModule } from 'src/modules/menu/menu.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from "ngx-spinner";
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserReportComponent } from './users/user-report.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageUserPermissionsComponent } from './manage-permissions/manage-permissions.component';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    ConfirmDialogModule,
    DividerModule,
    MultiSelectModule,
    PanelModule,
    FormsModule,
    TableModule,
    ToastModule,
    NgxSpinnerModule,
    ButtonModule,
    InputSwitchModule,
    InputTextModule
  ],
  providers: [ConfirmationService],
  declarations: [UsersComponent, UserReportComponent, ManageUserComponent, ManageUserPermissionsComponent]
})
export class UsersModule { }
