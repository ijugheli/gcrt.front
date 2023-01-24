import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AttrPermissionTypes } from 'src/app/app.config';
import { MUserPermission, User } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { UserService } from 'src/services/user.service';
import { IResponse, IUserPermission } from 'src/app/app.interfaces';

@Component({
  selector: 'app-manage-user-permissions',
  templateUrl: './manage-permissions.component.html',
  styleUrls: ['./manage-permissions.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})

export class ManageUserPermissionsComponent implements OnInit {

  constructor(
    private attributes: AttributesService,
    private userService: UserService,
    private messageService: MessageService,
    private route: ActivatedRoute) { }

  public userID: number = 0;
  public user!: User | null;
  public attributesList: MAttribute[] = [];
  public attrPermissionTypes = AttrPermissionTypes;
  public initialUserPermissions: MUserPermission[] = []; // for error backup
  public userPermissions: MUserPermission[] = [];
  public isLoading: boolean = false;
  public pageTitle: string = 'წვდომების მართვა';

  public filters: { [key: string]: number | string | null } = {
    'title': ''
  };

  ngOnInit(): void {
    this.init();
  }

  public updateAttrPermission(attrID: number, type: AttrPermissionTypes, value: boolean) {
    this.userService.saveAttrPermission(this.userID, attrID, { 'permission_type': type, 'permission_value': value }).subscribe((data) => {
      const response = data as IResponse;
      if (response.code == 0) {
        this.messageService.add({
          severity: 'error',
          summary: response.message,
        });
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: response.message,
      });

      const attrPermission = this.user?.permissions.find((permission) => permission.attr_id == attrID) || null;

      this.initialUserPermissions = this.userPermissions; // reassign updated data for backup

      if (attrPermission != null) {
        // if permission exists update it
        const index = this.user?.permissions.indexOf(attrPermission);
        this.user!.permissions[index!] = response.data as IUserPermission;
        return;
      }

      this.user?.permissions.push(response.data as IUserPermission);

      // update user in existing list
      const userIndex = this.userService.users.indexOf(this.user!);
      this.userService.users[userIndex] = this.user!;
    }, (error) => {
      this.userPermissions = this.initialUserPermissions; // restore old data on error

      this.messageService.add({
        severity: 'error',
        summary: 'ოპერაციის შესრულებისას მოხდა შეცდომა',
      });
    });
  }

  private async init() {
    this.isLoading = true;
    this.userID = parseInt(this.route.snapshot.paramMap.get('user_id')!);
    this.user = await this.userService.getUser(this.userID);
    this.pageTitle = this.pageTitle + ' - ' + this.user.name + ' ' + this.user.lastname;
    this.attributesList = this.attributes.asList();
    this.parseData();
    this.isLoading = false;
  }

  private parseData() {
    for (const attribute of this.attributesList) {
      const attrPermission = this.user?.permissions.find((permission) => permission.attr_id == attribute.id) || null;

      const permission = MUserPermission.from(attribute, attrPermission);

      this.userPermissions.push(permission);
    }
  }
}
