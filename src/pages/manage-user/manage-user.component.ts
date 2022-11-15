import { Component, OnInit } from '@angular/core';
import { validateEmail } from 'src/app/app.func';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/app.models';

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
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.userID = this.route.snapshot.params['user_id'] ? parseInt(this.route.snapshot.params['user_id']) : null;

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
    window.location.href = '/users/';
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
    this.userID != null
      ? this.edit()
      : this.add();
  }

  private add() {
    this.spinner.show();
    this.userService
      .add(this.values)
      .subscribe((data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'სისტემის მომხმარებელი მომხმარებელი ' + this.values['email'] + ' წარმატებით დაემატა',
        });
        this.spinner.hide();
        setTimeout(() => {
          window.location.href = '/users/';
        }, 500);
      }, (error) => {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error',
          summary: (error != null && error.hasOwnProperty('StatusMessage'))
            ? error.statusMessage
            : 'არასწორი მომხმარებლის მონაცემები',
          detail: 'გთხოვთ სცადოთ განსხვავებული პარამეტრები'
        });
      });
  }

  private edit() {
    this.spinner.show();

    if (this.userID == null) {
      return;
    }

    this.userService
      .edit(this.userID, this.values)
      .subscribe((data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'სისტემის მომხმარებლის ' + this.values['email'] + ' ცვლილება წარმატებით დასრულდა',
        });
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error',
          summary: (error != null && error.hasOwnProperty('StatusMessage'))
            ? error.statusMessage
            : 'არასწორი მომხმარებლის მონაცემები',
          detail: 'გთხოვთ სცადოთ განსხვავებული პარამეტრები'
        });
      });
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
