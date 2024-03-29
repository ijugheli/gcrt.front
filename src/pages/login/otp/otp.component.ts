import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/AuthService.service';
import { Router } from '@angular/router';
import { APIResponse } from 'src/app/app.interfaces';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['../login.component.css'],
  providers: [InputTextModule, MessageService]
})
export class OTPComponent implements OnInit {

  public code: string = '';
  public email: string | null | undefined;
  public validation: boolean = false;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.email = this.authService.getOTPEmail();

    if (this.email == null) {
      this.router.navigate(['login'], { replaceUrl: true });
    }

    this.authService.removeOTPEmail();
  }

  onValueUpdate() {
    this.validation = false;
  }

  onSubmit() {
    this.validation = true;


    if (!this.isValid(this.code)) {
      return;
    }

    let data = {
      'code': parseInt(this.code),
    };

    this.spinner.show();

    // TO-DO handle redirect on error
    this.authService.validateCode(data).subscribe((data) => {
      this.spinner.hide();
      const response: APIResponse = data;

      this.showSuccess(response.message);
      this.authService.authorize(response.data);
      this.router.navigate(['/home'], { replaceUrl: true }).then(() => setTimeout(() => window.location.reload(), 500));
    }, (error) => {
      this.spinner.hide();
      this.showError(error.error.message);
    }, () => {
      this.spinner.hide();
    });
  }

  isValid(v: string) {
    if (!this.validation) {
      return true;
    }
    return !(v == null || v == '');
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
}
