import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/AuthService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { validateEmail } from 'src/app/app.func';
import { UserService } from 'src/services/user.service';
import { APIResponse } from 'src/app/app.interfaces';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['../login.component.css'],
  providers: [InputTextModule, MessageService]
})
export class UpdatePasswordComponent implements OnInit {
  public email!: string | null;
  public hash!: string | null;
  public password: string = '';
  public password_confirmation: string = '';
  public validation: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.init();
  }

  onValueUpdate() {
    this.validation = false;
  }

  onSubmit() {
    this.validation = true;

    if (!this.isFormValid()) {
      return;
    }

    let info = {
      'email': this.email,
      'password': this.password,
      'password_confirmation': this.password_confirmation,
    };

    this.userService.updatePassword(info).subscribe((data) => {
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
      console.log(error);
      this.spinner.hide();
      this.showError('დაფიქსირდა შეცდომა');
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

  private init() {
    this.route.queryParams
      .subscribe(params => {
        this.hash = params['hash'];
        this.email = params['email'];

        if (this.hash === undefined || this.email === undefined) {
          this.showError('ლინკი არავალიდურია');
          setTimeout(function () {
            window.location.href = '/login';
          }, 1000);
          return;
        }
      }
      );

    let data = { 'code': this.hash, 'email': this.email };

    this.authService.validateCode(data).subscribe((data) => {
      const response: APIResponse = data;

      if (!response.code) {
        this.spinner.hide();
        this.showError(response.message);

        setTimeout(function () {
          window.location.href = '/login';
        }, 1000);
      }

    }, (error) => {
      this.spinner.hide();
      this.showError('დაფიქსირდა შეცდომა');
      setTimeout(function () {
        window.location.href = '/login';
      }, 1000);
    }, () => {
      this.spinner.hide();
    });
  }


  isFormValid(): boolean {
    if (this.password !== this.password_confirmation) {
      return false;
    }
    return true;
  }

  isValid(v: string) {
    if (!this.validation) {
      return true;
    }
    return !(v == null || v !== '');
  }
}
