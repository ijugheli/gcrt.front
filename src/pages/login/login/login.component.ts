import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/AuthService.service';
import { Router } from '@angular/router';
import { IResponse } from 'src/app/app.interfaces';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login.component.css'],
  providers: [InputTextModule, MessageService]
})
export class LoginComponent implements OnInit {
  public showCaptcha: boolean = true;
  public googleKey = '6LejhuMiAAAAAC37fA8yLKFCzImVZo7tGtQXjifP';

  public username: string = '';
  public password: string = '';
  public validation: boolean = false;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public router: Router
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      window.location.href = '/home';
    }
  }

  showResponse(d: any) {
  }

  onValueUpdate() {
    this.validation = false;
  }

  onSubmit() {
    this.validation = true;


    if (!this.isValid(this.username) || !this.isValid(this.password)) {
      console.log('Not Valid');
      return;
    }

    let info = {
      'email': this.username,
      'password': this.password
    };

    this.spinner.show();

    this.authService.login(info).subscribe((authData) => {
      this.spinner.hide();
      const response: IResponse = authData;

      if (response.code == 0) {
        this.messageService.add({
          severity: 'error',
          summary: response.message,
        });
        return;
      }

      if (response?.data == null && response.code == 1) {
        this.authService.storeOTPEmail(info.email);
        this.messageService.add({
          severity: 'success',
          summary: 'კოდი წარმატებით გამოიგზავნა თქვენს მეილზე!',
          detail: 'გთხოვთ დაელოდოთ...'
        });
        this.router.navigate(['/otp']);
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'ავტორიზაცია წარმატებით დასრულდა!',
        detail: 'გთხოვთ დაელოდოთ...'
      });


      setTimeout(() => {
        this.authService.authorize(authData.data);
        this.router.navigate(['/home'], { replaceUrl: true }).then(() => setTimeout(() => window.location.reload(), 200));
      }, 500);
    }, (error) => {
      this.spinner.hide();
      this.messageService.add({
        severity: 'error',
        summary: error.error.message,
      });
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
}
