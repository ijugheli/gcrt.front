import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user.component';
import { MenuModule } from 'src/modules/menu/menu.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';


@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    FormsModule,
    ButtonModule,
    NgxSpinnerModule,
    DividerModule,
    CardModule,
    InputMaskModule,
    PanelModule,
    ToastModule,
    InputTextModule
  ],
  declarations: [ManageUserComponent]
})
export class ManageUserModule { }
