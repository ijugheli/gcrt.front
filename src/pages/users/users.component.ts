import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/app.models';
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { APIResponse } from 'src/app/app.interfaces';
interface cachedFilter {
  value: string;
  matdhMode?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [MessageService, DialogService],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public data: any;

  public filters: { [key: string]: number | string | null } = {
    'name': '',
    'email': '',
    'lastname': '',
    'phone': '',
    'address': '',
  };

  public storageKey = 'gcrt-users-session';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private confirmationService: ConfirmationService,) {

  }

  ngOnInit() {
    if (this.router.url.includes('/users/add')) {
      this.onEdit();
    };
    this.getUsers();
  }

  public updateBooleanColumns(user: User, event: any) {
    this.userService.updateBooleanColumns(user.id, { 'status_id': user.status_id, 'otp_enabled': user.otp_enabled }).subscribe((data) => {
      const response: APIResponse = data;

      this.showSuccess(response.message);
    }, (error) => {
      this.showError(error.error.message);
    });
  }

  public onDelete(userID: number) {
    this.confirmationService.confirm({
      header: 'მომხმარებლის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული მომხმარებლის წაშლა?',
      accept: () => {
        this.remove(userID);
      }, reject: () => {
      }
    });
  }

  public onEdit(userID?: number) {
    this.dialogService.open(ManageUserComponent, {
      data: { userID: typeof userID != 'undefined' ? userID : null, },
      width: '30%',
      position: 'top',
    }).onClose.subscribe((data: any) => this.getUsers());
  }

  public onPermissions(userID: number) {
    this.router.navigateByUrl(`/users/permissions/${userID}`);
  }

  private getUsers() {
    this.spinner.show();
    this.userService.list().subscribe((response: APIResponse<User[]>) => {
      const users: User[] = response.data!;

      this.spinner.hide();

      this.users = users;
      this.userService.users = users;
    }, (error) => {
      this.spinner.hide();

      this.showError(error.error.message);
    }, () => {

    });
  }

  private remove(userID: number): void {
    this.spinner.show();
    this.userService.delete(userID).subscribe((data) => {
      this.spinner.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'სისტემის მომხმარებლის წაშლა წარმატებით დასრულდა.',
      });
      this.getUsers();
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'ოპერაციის შესრულებისას მოხდა შეცდომა',
      });
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
}


