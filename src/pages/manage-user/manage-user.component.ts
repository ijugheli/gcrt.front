import { Component, OnInit } from '@angular/core';
import { validateEmail } from 'src/app/app.func';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
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
  public actionTitle = 'დამატება';


  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.userID = parseInt(this.dialogConfig.data?.userID) || null;

    this.loadUser();
  }

  private loadUser() {
    if (this.userID == null) {
      return;
    }

    this.spinner.show();

    this.userService.details(this.userID).subscribe((data) => {
      this.actionTitle = 'რედაქტირება';
      this.values['email'] = data.email;
      this.values['name'] = data.name;
      this.values['lastname'] = data.lastname;
      this.values['phone'] = data.phone;
      this.values['address'] = data.address;
      this.spinner.hide();
    }, (error) => {
      this.userID = null;
      this.spinner.hide();
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
      console.log('VALIDATION ERROR');
      setTimeout(() => {
        this.validation = false;
      }, 5000);
      return;
    }
    console.log('HERE');

    this.handleSubmit();
  }


  private handleSubmit() {
    this.spinner.show();

    if (this.userID == null) {
      this.userService
        .add(this.values)
        .subscribe((data) => {
          this.showSuccess();
        }, (error) => {
          this.showError(error);
        });
      return;
    }

    this.userService
      .edit(this.userID, this.values)
      .subscribe((data) => {
        this.showSuccess();
      }, (error) => {
        this.showError(error);
      });
  }

  private showSuccess() {
    const msg = this.userID != null ? 'რედაქტირდა' : 'დაემატა';
    this.messageService.add({
      severity: 'success',
      summary: 'სისტემის მომხმარებელი ' + this.values['email'] + ' წარმატებით ' + msg,
    });
    this.spinner.hide();
  }

  private showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: (error != null && error.hasOwnProperty('StatusMessage'))
        ? error.statusMessage
        : 'არასწორი მომხმარებლის მონაცემები',
      detail: 'გთხოვთ სცადოთ განსხვავებული პარამეტრები'
    });
    this.spinner.hide();
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


}
