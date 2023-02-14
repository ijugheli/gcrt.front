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
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
import { OTPComponent } from '../otp/otp.component';



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
        CalendarModule,
        RouterModule,
    ],
    exports: [
        LoginComponent, ForgotPasswordComponent, UpdatePasswordComponent, OTPComponent
    ],
    providers: [UserService, AuthService],
    declarations: [LoginComponent, ForgotPasswordComponent, UpdatePasswordComponent, OTPComponent]
})
export class LoginModule { }
