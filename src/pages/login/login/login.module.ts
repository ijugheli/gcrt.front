import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { LoginComponent } from './login.component';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CaptchaModule } from 'primeng/captcha';
import { CheckboxModule } from 'primeng/checkbox';
import { UserService } from 'src/services/user.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/AuthService.service';



@NgModule({
    imports: [
        CommonModule,
        MultiSelectModule,
        EditorModule,
        FormsModule,
        InputTextModule,
        InputSwitchModule,
        ToastModule,
        InputNumberModule,
        DividerModule,
        CaptchaModule,
        DropdownModule,
        CheckboxModule,
        CardModule,
        AccordionModule,
        NgxSpinnerModule,
        CalendarModule
    ],
    exports: [
        LoginComponent
    ],
    providers: [UserService, AuthService],
    declarations: [LoginComponent]
})
export class LoginModule { }
