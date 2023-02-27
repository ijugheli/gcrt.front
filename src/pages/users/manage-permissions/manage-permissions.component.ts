import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AttrPermissionTypes, ATTR_TYPES_IDS_NAME } from 'src/app/app.config';
import { APIResponse, IUserPermission } from 'src/app/app.interfaces';
import { MUserPermission, User } from 'src/app/app.models';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { UserService } from 'src/services/user.service';

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
    private route: ActivatedRoute
  ) { }

  public userID: number = 0;
  public selectedTypes: any;
  public user!: User | null;
  public attributesList: MAttribute[] = [];
  public attrTypeFilter: any;
  public attrPermissionTypes = AttrPermissionTypes;
  public initialUserPermissions: MUserPermission[] = []; // If we have error we can restore old Data
  public userPermissions: MUserPermission[] = [];
  public filteredData: MUserPermission[] = [];
  public isLoading: boolean = false;
  public pageTitle: string = 'წვდომების მართვა';

  public filters: { [key: string]: number | string | null } = {
    'title': ''
  };

  ngOnInit(): void {
    this.attrTypeFilter = Array.from(ATTR_TYPES_IDS_NAME).map((item) => { return { type: item[0], name: item[1] } });
    this.init();
  }

  public updateAttrPermission(attrID: number, type: AttrPermissionTypes, value: boolean) {
    this.userService.saveAttrPermission(this.userID, attrID, { 'permission_type': type, 'permission_value': value }).subscribe((data) => {
      const response: APIResponse<IUserPermission> = data;

      this.handleAttrUpdate(attrID, response);

      this.messageService.add({
        severity: 'success',
        summary: response.message,
      });
    }, (error) => {
      this.userPermissions = this.initialUserPermissions; // Assign previous data

      this.messageService.add({
        severity: 'error',
        summary: error.error.emssage,
      });
    });
  }

  public filterTable(event: any) {
    const ids = this.selectedTypes.map((i: any) => i.type);

    this.filteredData = this.userPermissions.filter((i) => ids.length > 0 ? ids.includes(i.attributeType) : i);
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

  private handleAttrUpdate(attrID: number, response: APIResponse<IUserPermission>,) {
    const attrPermission: IUserPermission | null = this.user?.permissions.find((permission) => permission.attr_id == attrID) || null;

    this.initialUserPermissions = this.userPermissions; // assign updated data for backup

    // If permission exists update it
    if (attrPermission != null) {
      const index: number | undefined = this.user?.permissions.indexOf(attrPermission);
      this.user!.permissions[index!] = response.data as IUserPermission;
      return;
    }

    this.user?.permissions.push(response.data as IUserPermission);

    // Update user in existing list
    const userIndex: number = this.userService.users.indexOf(this.user!);
    this.userService.users[userIndex] = this.user!;
  }

  private parseData() {
    for (const attribute of this.attributesList) {
      const attrPermission: IUserPermission | null = this.user?.permissions.find((permission) => permission.attr_id == attribute.id) || null;

      const permission: MUserPermission = MUserPermission.from(attribute, attrPermission);

      this.userPermissions.push(permission);
    }

    this.filteredData = this.userPermissions;
  }
}
