import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MOption } from '../../services/attributes/models/option.model';
import { IResponse } from 'src/app/app.interfaces';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { AddAttributeComponent } from './add-attribute/add-attribute.component';
import { ATTR_TYPE_ID, ATTR_TYPE_NAME } from 'src/app/app.config';
import { AddSectionComponent } from './add-section/add-section.component';
import { AddSectionPropertyComponent } from './add-section-property/add-section-property.component';


@Component({
  selector: 'app-attributes-structure',
  templateUrl: './attributes-structure.component.html',
  styleUrls: ['./attributes-structure.component.css'],
  providers: [MessageService]
})

export class AttributesStructureComponent implements OnInit {
  public pageTitle: string = 'მონაცემთა სტრუქტურების მართვა';
  public isLoading: boolean = false;
  public addPropertyButton = false;
  public list: { [key: string]: MAttribute[] } = {};
  public attributes: MAttribute[] = [];
  public addPropertiesData: MProperty = new MProperty();
  public attrType: any = {
    'standard': 'სტანდარტული ატრიბუტები',
    'tree': 'ხისებრი ატრიბუტები',
    'entity': 'ობიექტი',
    1: 'standard',
    2: 'tree',
    3: 'entity'
  };

  public fieldsets: any = {
    'standard': true,
    'tree': true,
    'entity': true,
  };

  public dataTypesMap: any = {
    1: { name: 'string', id: 1, title: 'ტექსტი' },
    2: { name: 'int', id: 2, title: 'მთელი რიცხვი' },
    3: { name: 'double', id: 3, title: 'წილადი რიცხვი' },
    4: { name: 'date', id: 4, title: 'თარიღი' },
    5: { name: 'boolean', id: 5, title: 'კი/არა' },
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
    // 11 : {name : 'timepicker', id : 11, title : 'timepicker'},
    // 12 : {name : 'datetimepicker', id : 12, title : 'datetimepicker'},
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
    public attributesService: AttributesService,
    public messageService: MessageService,
    public dialogService: DialogService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.initializeData();
  }

  public getAttrTypeID(name: string): number {
    return ATTR_TYPE_ID(name) as number;
  }

  public getAttrTypeName(name: string): string {
    return ATTR_TYPE_NAME(name) as string;
  }

  public addRecord(attrID: number, data: any) {
    this.attributesService.addProperty(attrID, data);
  }

  public reorderProperties(data: any, attrID: number) {
    let propertyIDs = [];
    for (let i in data) {
      propertyIDs.push(data[i]['id']);
    }
    this.attributesService.reorderProperties(attrID, JSON.stringify(propertyIDs));
    this.attributes = this.attributesService.asList();
  }

  public updateAttr(attr: MAttribute, value: any, isLazy?: boolean) {
    const oldAttr: MAttribute | undefined = this.attributes.find((val) => val.id == attr.id);

    let newAttr = { ...attr };

    newAttr.children = newAttr.tabs = newAttr.properties = newAttr.columns = newAttr.sections = newAttr.tabs = [];

    this.attributesService.updateAttr(attr.id, { 'data': newAttr }).subscribe((data) => {
      const response: IResponse = data;

      if (!response.code) {
        this.showError(response.message);
        this.restoreOldValue(oldAttr!, value, isLazy || false);
        return;
      }
      this.showSuccess(response.message);
    }, (error) => {
      this.showError('დაფიქსირდა შეცდომა');

      this.restoreOldValue(oldAttr!, value, isLazy || false);
    });
  }

  public updateProperty(property: MProperty, fieldName: any, isPrimary: boolean = false, attrType: string = '') {
    this.attributesService.updateProperty(property.id, property).subscribe((data) => {
      const response = data as IResponse;

      if (!response.code) {
        this.showError(response.message);
        return;
      }

      if (isPrimary) {
        this.list[attrType].find((i) => i.id === property.attr_id)?.properties.forEach((data) => {
          if (data.id === property.id) return;
          data.is_primary = false;
        });
      }

      this.showSuccess(response.message);
    }, (error) => {
      this.showError('დაფიქსირდა შეცდომა');
    })
  }



  public onAddAttrClick(type: number) {
    this.dialogService.open(AddAttributeComponent, {
      data: { type: type, },
      width: '30%',
      position: 'top',
    });
  }

  public onAddSectionClick(attrID: number) {
    const ref = this.dialogService.open(AddSectionComponent, {
      data: { attrID: attrID, },
      width: '30%',
      position: 'top',
    });

    ref.onClose.subscribe(this.updateAttributeOnAdd);
  }
  public onAddSectionPropertyClick(property: MProperty, attrID: number) {
    const ref = this.dialogService.open(AddSectionPropertyComponent, {
      data: { property: property, attrSources: this.attrSources, attrID: attrID },
      width: '30%',
      position: 'top',
    });

    ref.onClose.subscribe(this.updateAttributeOnAdd);
  }

  public getSourceAttrTitle(attrID: number) {
    return this.attributes.find((i) => i.id == attrID)?.title;
  }

  private async initializeData() {
    this.isLoading = true;
    this.spinner.show();

    await this.initializeAttrList();

    this.initializeDataTypes();
    this.initializeViewTypes();
    this.attrSources = this.attributes.map((attr: MAttribute) => MOption.from(attr.id, attr.title as string));

    this.isLoading = false;
    this.spinner.hide();
  }

  private async initializeAttrList() {
    await this.attributesService.requestAttributes();
    const list: MAttribute[] = this.attributesService.asList();

    this.attributes = list;

    this.list['standard'] = list.filter((i) => i.isStandard());
    this.list['tree'] = list.filter((i) => i.isTree());
    this.list['entity'] = list.filter((i) => i.isEntity());
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

  private updateAttributeOnAdd = (newAttribute: MAttribute) => {
    if (newAttribute) {
      this.initializeAttrList()
    }
  };

  onRowReorder(event: any, id: any, propertyData: any) {
    this.reorderProperties(propertyData, id);
  }

  toggleFieldset(type: string, value: boolean) {
    this.fieldsets[type] = value;

    // to close other fieldesets
    for (let key in this.fieldsets) {
      if (key == type) continue;

      this.fieldsets[key] = true;
    }
  }
  closeFieldsets() {
    for (let key in this.fieldsets) {
      this.fieldsets[key] = true;
    }
  }

}
