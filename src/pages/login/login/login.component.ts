import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from 'src/services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/AuthService.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [InputTextModule, MessageService]
})
export class LoginComponent implements OnInit {
  public showCaptcha: boolean = true;
  public googleKey = '6LejhuMiAAAAAC37fA8yLKFCzImVZo7tGtQXjifP';

  public username: string = '';
  public password: string = '';
  public validation: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public router: Router
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.showCaptcha = true;
    }, 500);
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

    this.userService.login(info).subscribe((authData) => {

      this.spinner.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'ავტორიზაცია წარმატებით დასრულდა!',
        detail: 'გთხოვთ დაელოდოთ...'
      });

      this.authService.authorize(authData);
      setTimeout(() => {
        this.router.navigate(['/manage/5'])
      }, 100);
    }, (error) => {
      this.spinner.hide();
      this.messageService.add({
        severity: 'error',
        summary: 'ავტორიზაცია ვერ მოხერხდა!',
        detail: 'მომხმარებელი ან პაროლი არასწორია. სცადეთ განსხვავებული კომბინაცია.'
      });
    }, () => {

    });
  }

  isValid(v: string) {
    if (!this.validation) {
      return true;
    }
    return !(v == null || v == '');
  }
}
