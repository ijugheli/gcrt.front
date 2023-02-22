import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/AuthService.service';
import { Router } from '@angular/router';
import { validateEmail } from 'src/app/app.func';
import { APIResponse } from 'src/app/app.interfaces';
import { ACTION_TYPE_ID, VALIDATION_TYPE_ID } from 'src/app/app.config';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login.component.css'],
  providers: [InputTextModule, MessageService]
})
export class ForgotPasswordComponent implements OnInit {
  public email: string = '';
  public validation: boolean = false;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public router: Router
  ) {
  }

  ngOnInit() { }

  showResponse(d: any) {
  }

  onValueUpdate() {
    this.validation = false;
  }

  onSubmit() {
    this.validation = true;

    if (!validateEmail(this.email)) {
      return;
    }

    let info = {
      'email': this.email,
      'actionType': ACTION_TYPE_ID('RECOVER_PASSWORD'),
      'validationType': VALIDATION_TYPE_ID('EMAIL'),
    };

    this.spinner.show();

    this.authService.sendCode(info).subscribe((data) => {
      this.authService.storeOTPEmail(this.email);
      this.spinner.hide();
      const response: APIResponse = data;

      if (!response.code) {
        this.showError(response.message);
        return;
      }

      this.showSuccess(response.message);

      setTimeout(function () {
        window.location.href = '/login';
      }, 1000);
    }, (error) => {
      this.spinner.hide();
      this.showError(error.error.message);
    }, () => {
      this.spinner.hide();
    });
  }


  private showSuccess(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
  }

  private showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: error,
    });
  }

  isValid(v: string) {
    if (!this.validation) {
      return true;
    }
    return !(v == null || validateEmail(v) == null);
  }
}
