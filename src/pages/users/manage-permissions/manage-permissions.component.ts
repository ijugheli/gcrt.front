import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { AttrPermissionTypes, ATTR_TYPES_IDS_NAME } from 'src/app/app.config';
import { getRouteParam } from 'src/app/app.func';
import { APIResponse, IUserPermission } from 'src/app/app.interfaces';
import { MUserPermission, User } from 'src/app/app.models';
import { MenuService } from 'src/services/app/menu.service';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-manage-user-permissions',
  templateUrl: './manage-permissions.component.html',
  styleUrls: ['./manage-permissions.component.css'],
  providers: [MessageService],
})

export class ManageUserPermissionsComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private attrService: AttributesService,
    private messageService: MessageService,
    public menuService: MenuService,


  ) { }


  public userID: number = parseInt(getRouteParam('user_id'));
  public selectedTypes: any;
  public user!: User | null;
  public attrTypeFilter: any;
  public attrPermissionTypes = AttrPermissionTypes;
  public initialUserPermissions: MUserPermission[] = []; // If we have error we can restore old Data
  public userPermissions: MUserPermission[] = [];
  public filteredData: MUserPermission[] = [];
  public isLoading: boolean = false;
  public pageTitle: string = 'წვდომების მართვა';
  public attributes$!: Subscription;

  public filters: { [key: string]: number | string | null } = {
    'title': ''
  };

  ngOnInit(): void {
    this.attrTypeFilter = Array.from(ATTR_TYPES_IDS_NAME).map((item) => { return { type: item[0], name: item[1] } });
    this.init();
  }

  public updateAttrPermission(attrID: number, type: AttrPermissionTypes, value: boolean) {
    const attrPermission: MUserPermission | null = this.userPermissions.find((permission) => permission.attr_id == attrID) || null;

    if (attrPermission?.can_view == false) {
      attrPermission.can_update = false;
      attrPermission.can_delete = false;
    }

    this.userService.saveAttrPermission(this.userID, attrID, { 'permission_type': type, 'permission_value': value }).subscribe((data) => {
      const response: APIResponse<IUserPermission> = data;

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

    this.user = await this.userService.getUser(this.userID);

    this.pageTitle = this.pageTitle + ' - ' + this.user.name + ' ' + this.user.lastname;


    this.parseData();

    this.isLoading = false;
  }

  private parseData() {
    this.attributes$ = this.attrService.getList().subscribe((attrs) => {
      for (const attribute of attrs) {
        const attrPermission: IUserPermission | null = this.user?.permissions.find((permission) => permission.attr_id == attribute.id) || null;

        const permission: MUserPermission = MUserPermission.from(attribute, attrPermission);

        this.userPermissions.push(permission);
      }

      this.filteredData = this.userPermissions;
    });
  }

  ngOnDestroy(): void {
    this.attributes$.unsubscribe();
  }
}
