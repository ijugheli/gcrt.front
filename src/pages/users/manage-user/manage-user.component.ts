import { Component, OnInit } from '@angular/core';
import { validateEmail } from 'src/app/app.func';
import { UserService } from '../../../services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { APIResponse } from 'src/app/app.interfaces';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['../../attributes-structure/dialog.component.css'],
  providers: [MessageService]
})
export class ManageUserComponent implements OnInit {

  public validation: boolean = false;
  public values: { [key: string]: string } = {
    'email': '',
    'name': '',
    'lastname': '',
    'phone': '',
    'address': '',
    'password': '',
  };
  public userID!: number | null;
  public actionTitle: string = 'დამატება';


  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    // Null if we add new user
    this.userID = parseInt(this.dialogConfig.data?.userID) || null;

    this.loadUser();
  }

  public isEmailValid() {
    if (!this.validation) {
      return true;
    }

    return validateEmail(this.values['email']);
  }

  public isValidValue(key: string) {
    if (!this.validation) {
      return true;
    }

    return this.values[key] != null && this.values[key] != '';
  }

  private loadUser() {
    if (this.userID == null) {
      return;
    }

    this.userService.details(this.userID).subscribe((data) => {
      this.actionTitle = 'რედაქტირება';
      this.values['email'] = data.email;
      this.values['name'] = data.name;
      this.values['lastname'] = data.lastname;
      this.values['phone'] = data.phone;
      this.values['address'] = data.address;
    }, (error) => {
      this.userID = null;
    });
  }

  private handleSubmit() {
    this.spinner.show();

    if (this.userID == null) {
      this.addUser();
      return;
    }

    this.editUser();
  }

  private addUser() {
    this.userService
      .add(this.values)
      .subscribe(this.handleSuccessResponse, this.handleErrorResponse);
  }


  private editUser() {
    this.userService
      .edit(this.userID!, this.values)
      .subscribe(this.handleSuccessResponse, this.handleErrorResponse);

  }

  private handleSuccessResponse = (data: APIResponse) => {
    const response: APIResponse = data;

    this.spinner.hide();

    this.showSuccess(response.message);

    this.closeDialog();
  }

  private handleErrorResponse = (error: any) => {
    this.spinner.hide();

    this.showError(error.error.message);
  }


  private closeDialog() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
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

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.validation = true;

    if (!this.isEmailValid() ||
      !this.isValidValue('name') ||
      !this.isValidValue('lastname') ||
      !this.isValidValue('phone') ||
      (this.userID == null && !this.isValidValue('password'))) {
      setTimeout(() => {
        this.validation = false;
      }, 5000);
      return;
    }

    this.handleSubmit();
  }
}
