import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/app.models';
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { IResponse } from 'src/app/app.interfaces';
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
      this.handleClick();
    };
    this.getUsers();
  }

  private getUsers() {
    this.spinner.show();
    this.userService.list().subscribe((users) => {
      this.users = users;
      this.userService.users = this.users;
      // this.parseFilters();
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    }, () => {

    });
  }



  // private parseFilters() {
  //   let storageFilters = localStorage.getItem(this.storageKey);
  //   console.log('///////////////////////////////');
  //       console.log(storageFilters);
  //   console.log('///////////////////////////////');
  //   if (storageFilters == null) {
  //     return;
  //   }

  //   let filters = JSON.parse(storageFilters)['filters'];
  //   if (filters == null) {
  //     return;
  //   }

  //   let filterableKeys = Object.keys(this.filters);
  //   let keys = Object.keys(filters);
  //   let values: cachedFilter[] = Object.values(filters) as cachedFilter[];
  //   for (let i = 0; i < keys.length; i++) {
  //     let key: string = keys[i];
  //     let filter: cachedFilter = values[i];

  //     if (filterableKeys.includes(key) &&
  //       filter.value != null &&
  //       filter.value != '') {
  //       this.filters[key] = filter.value;
  //     }
  //   }
  // }

  private remove(userID: number): void {
    this.spinner.show();
    this.userService.delete(userID).subscribe((data) => {
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

  public updateBooleanColumns(user: User, event:any) {
    this.userService.updateBooleanColumns(user.id, { 'status_id': user.status_id, 'otp_enabled': user.otp_enabled }).subscribe((data) => {
      const response: IResponse = data;

      if (response.code == 0) return this.showError(response.message);

      this.showSuccess(response.message);
    }, (error) => {
      this.showError('დაფიქსირდა შეცდომა');
    });
  }
  public handleClick(userID?: number) {
    this.dialogService.open(ManageUserComponent, {
      data: { userID: userID != undefined ? userID : null, },
      width: '30%',
      position: 'top',
    });
  }

  public onPermissions(userID: number) {
    this.router.navigateByUrl(`/users/permissions/${userID}`);
  }

  private showSuccess(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
    this.spinner.hide();
  }

  private showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: error,
    });
    this.spinner.hide();
  }


}


