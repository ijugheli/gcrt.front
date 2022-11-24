import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [MessageService]
})
export class ChangePasswordComponent implements OnInit {
  public validators: { [key: string]: boolean } = {
    'currentPassword': true,
    'newPassword': true,
    'confirmPassword': true,
  }
  public values: { [key: string]: string } = {
    'currentPassword': '',
    'newPassword': '',
    'confirmPassword': '',
  }

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  public cleanValidation() {
    Object.keys(this.values).forEach((name) => {
      this.validators[name] = true;
    });
  }

  public cleanValues() {
    Object.keys(this.values).forEach((name) => {
      this.values[name] = '';
    });
  }


  public validate() {
    Object.keys(this.values).forEach((name) => {
      this.validators[name] = this.values[name] != '';
    });

    if (this.values['newPassword'] != this.values['confirmPassword']) {
      this.validators['newPassword'] =
        this.validators['confirmPassword'] = false;
    }

    return !Object.values(this.validators).includes(false);
  }


  public onSubmit() {
    if (!this.validate()) {
      return;
    }

    this.spinner.show();
    this.userService.changePassword(this.values);


    this.userService.changePassword(this.values).subscribe((response) => {
      this.spinner.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'ოპერაცია წარმატებით დასრულდა.',
        detail: 'პაროლი ცვლილება წარმატებით დასრულდა.'
      });
      this.spinner.hide();
      this.cleanValues();
    }, (error) => {
      this.spinner.hide();
      this.messageService.add({
        severity: 'error',
        summary: error,
        detail: 'გთხოვთ სცადოთ განსხვავებული პარამეტრები.'
      });
    });
  }
}
