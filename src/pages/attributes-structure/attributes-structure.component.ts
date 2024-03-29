import { Component, OnDestroy, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MOption } from '../../services/attributes/models/option.model';
import { APIResponse } from 'src/app/app.interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddAttributeComponent } from './add-attribute/add-attribute.component';
import { ATTR_TYPE_ID, ATTR_TYPE_NAME } from 'src/app/app.config';
import { AddSectionComponent } from './add-section/add-section.component';
import { AddSectionPropertyComponent } from './add-section-property/add-section-property.component';
import { MAttributeSection } from 'src/services/attributes/models/section.model';
import { getRouteParam } from 'src/app/app.func';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/services/app/menu.service';


@Component({
  selector: 'app-attributes-structure',
  templateUrl: './attributes-structure.component.html',
  styleUrls: ['./attributes-structure.component.css'],
  providers: [MessageService]
})

export class AttributesStructureComponent implements OnInit, OnDestroy {
  public pageTitle: string = 'მონაცემთა სქემები';
  public isLoading: boolean = false;
  public addPropertyButton = false;
  public attributes: MAttribute[] = [];
  private attrs$!: Subscription;
  public addPropertiesData: MProperty = new MProperty();
  public attrType: any = {
    'standard': 'სტანდარტული ატრიბუტები',
    'tree': 'ხისებრი ატრიბუტები',
    'entity': 'ობიექტი',
    1: 'standard',
    2: 'tree',
    3: 'entity'
  };
  public typeID: number = parseInt(getRouteParam('type_id')!);;


  public expandedSection: { [s: string]: boolean; } = {};
  public expandedAttr: { [s: string]: boolean; } = {};

  public dataTypesMap: any = {
    1: { name: 'string', id: 1, title: 'ტექსტი' },
    2: { name: 'int', id: 2, title: 'მთელი რიცხვი' },
    3: { name: 'double', id: 3, title: 'წილადი რიცხვი' },
    4: { name: 'date', id: 4, title: 'თარიღი' },
    5: { name: 'datetime', id: 5, title: 'დრო-თარიღი' },
    6: { name: 'boolean', id: 6, title: 'კი/არა' },
  };

  public viewTypesMap: any = {
    1: { name: 'input', id: 1, title: 'სტანდარტული ტექსტი' },
    2: { name: 'textarea', id: 2, title: 'გრძელი ტექსტი' },
    // 3 : {name : 'editable-textarea', id : 3,title : 'editable-textarea'},
    // 4 : {name : 'checkbox', id : 4, title : 'checkbox'},
    5: { name: 'toggle', id: 5, title: 'კი/არა' },
    6: { name: 'select', id: 6, title: 'სარჩევი' },
    // 7 : {name : 'searchable-select', id : 7,title : 'searchable-select'},
    8: { name: 'multiselect', id: 8, title: 'მრავალმნიშვნელოვანი სარჩევი' },
    // 9 : {name : 'searchable-multiselect', id : 9, title : 'searchable-multiselect'},
    10: { name: 'datepicker', id: 10, title: 'თარიღის სარჩევი' },
    11: { name: 'timepicker', id: 11, title: 'დროის სარჩევი' },
    12: { name: 'datetimepicker', id: 12, title: 'დრო/თარიღის სარჩევი' },
    13: { name: 'treeselect', id: 13, title: 'ხისებრი სარჩევი' },
    // 14 : {name : 'tableselect', id : 14, title : 'tableselect'},
  };

  public filters: { [key: string]: number | string | null } = {
    'title': ''
  };

  public dataTypes: any;

  public viewTypes: any;

  public attrSources: any;

  constructor(
    private attributesService: AttributesService,
    private messageService: MessageService,
    private dialogService: DialogService,
    public menuService: MenuService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.initializeData();
  }

  public getAttrTypeID(name: string): number {
    return ATTR_TYPE_ID(name) as number;
  }

  public getAttrTypeName(name: string | number): string {
    return ATTR_TYPE_NAME(name) as string;
  }

  public reorderProperties(data: any, attrID: number) {
    let propertyIDs = [];

    for (let i in data) {
      if (data[i] instanceof MAttributeSection) {
        propertyIDs.push(data[i]['propertyID']);
        continue;
      }

      propertyIDs.push(data[i]['id']);
    }

    this.attributesService.reorderProperties(attrID, JSON.stringify(propertyIDs));
  }

  public updateAttr(attr: MAttribute, value: any, isLazy?: boolean) {
    const oldAttr: MAttribute | undefined = this.attributes.find((val) => val.id == attr.id);

    if (typeof value == 'boolean') {
      oldAttr!.status_id = value;
    }

    let newAttr = { ...attr };

    newAttr.children = newAttr.tabs = newAttr.properties = newAttr.columns = newAttr.sections = newAttr.tabs = newAttr.options = [];

    this.attributesService.updateAttr(attr.id, { 'data': newAttr }).subscribe((data) => {
      const response: APIResponse = data;

      this.showSuccess(response.message);
      this.refreshAttrList();
    }, (error) => {
      this.showError(error.error.message);

      this.restoreOldValue(oldAttr!, value, isLazy || false);
    });
  }

  public updateProperty(property: MProperty, fieldName: any, isPrimary: boolean = false) {
    this.attributesService.updateProperty(property.id, property).subscribe((data) => {
      const response: APIResponse = data;

      if (isPrimary) {
        this.attributes.find((i) => i.id === property.attr_id)?.properties.forEach((data) => {
          if (data.id === property.id) return;
          data.is_primary = false;
        });
      }
      this.refreshAttrList();
      this.showSuccess(response.message);
    }, (error) => {
      this.showError(error.error.message);
    })
  }

  public onDeleteAttr(attrID: number) {
    this.confirmationService.confirm({
      header: 'ატრიბუტის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ატრიბუტის წაშლა?',
      accept: () => {
        this.attributesService.removeAttribute(attrID).subscribe((data) => {
          const response: APIResponse = data;

          this.attributes = this.attributes.slice(this.attributes.findIndex((i) => i.id === attrID), 1);

          this.refreshAttrList();

          this.showSuccess(response.message);
        }, (error) => {
          this.showError(error.error.message);
        });
      }, reject: () => {
      }
    });
  }

  public onDeleteProperty(propertyID: number, type: number, attrID: number) {
    const title = type == 1 ? 'პარამეტრის' : 'სექციის';

    this.confirmationService.confirm({
      header: title + 'წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: `დარწმუნებული ხართ რომ გსურთ არჩეული ${title} წაშლა?`,
      accept: () => {
        this.attributesService.removeProperty(propertyID).subscribe((data) => {
          const response: APIResponse = data;

          this.refreshAttrList();

          this.showSuccess(response.message);
        }, (error) => {
          this.showError(error.error.message);
        });
      }, reject: () => {
      }
    });
  }

  public onRowExpand(event: any) {
    const id = event.data.propertyID?.toString() ?? event.data.id?.toString();

    if (typeof event.data.propertyID != 'undefined' || event.data.title == 'მახასიათებლები') {
      this.expandedSection = { [event.data.title]: true };
      return
    }

    this.expandedAttr = { [id]: true };
  }

  public onAddAttrClick(type: number) {
    const ref: DynamicDialogRef = this.dialogService.open(AddAttributeComponent, {
      data: { type: type, },
      width: '30%',
      position: 'top',
    });
    ref.onClose.subscribe(this.reloadOnAdd);
  }

  public onAddClick(property: MProperty | null, attrID: number, isSectionProperty: boolean = false) {
    const component = isSectionProperty ? AddSectionPropertyComponent : AddSectionComponent;

    const ref: DynamicDialogRef = this.dialogService.open(component, {
      data: { property: property, attrSources: this.attrSources, attrID: attrID },
      width: '30%',
      position: 'top',
    });

    ref.onClose.subscribe(this.reloadOnAdd);
  }

  public getSourceAttrTitle(attrID: number) {
    return this.attributes.find((i) => i.id == attrID)?.title;
  }

  private async initializeData() {
    this.isLoading = true;
    this.spinner.show();

    this.pageTitle = this.pageTitle + ' - ' + this.getAttrTypeName(this.typeID);

    this.initializeDataTypes();
    this.initializeViewTypes();
    this.initAttrs();
    this.isLoading = false;
    this.spinner.hide();
  }

  private initAttrs(): void {
    this.refreshAttrList();
    this.attrs$ = this.attributesService.getStructureList().subscribe((attrs) => {
      this.attributes = attrs.filter((i) => i.type == this.typeID);
      this.attrSources = attrs.map((attr: MAttribute) => MOption.from(attr.id, attr.title as string));
    });
  }

  private refreshAttrList(): void {
    this.attributesService.load(true);
  }

  private initializeDataTypes() {
    this.dataTypes = Object.values(this.dataTypesMap);
  }

  private initializeViewTypes() {
    this.viewTypes = Object.values(this.viewTypesMap);
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

  private restoreOldValue(oldAttr: MAttribute, value: boolean, isLazy: boolean) {
    isLazy ? oldAttr!.lazy = !value : oldAttr!.status_id = Number(!value);
  }

  private reloadOnAdd = (isSuccess: boolean) => {
    if (isSuccess) {
      this.spinner.show();
      this.refreshAttrList();
      this.spinner.hide();
    }
  };

  onRowReorder(event: any, id: any, propertyData: any) {
    this.reorderProperties(propertyData, id);
  }

  ngOnDestroy(): void {
    this.attrs$.unsubscribe();
  }
}
