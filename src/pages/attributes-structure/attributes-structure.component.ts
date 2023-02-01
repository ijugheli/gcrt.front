import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MOption } from '../../services/attributes/models/option.model';
import { IResponse } from 'src/app/app.interfaces';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

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
  public attrID = 0;
  public list: { [key: string]: MAttribute[] } = {};
  public attributes: MAttribute[] = [];
  public addPropertiesData: MProperty = new MProperty();
  public attrTypeName: any = {
    'standard': 'სტანდარტული ატრიბუტები',
    'tree': 'ხისებრი ატრიბუტები',
    'entity': 'ობიექტი',
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


  public propertyTypeMap: any = {
    1: { name: 'int', id: 1, title: 'სტანდარტული' },
    2: { name: 'int', id: 2, title: 'სექცია' },
  };

  public viewTypesMap: any = {
    1: { name: 'input', id: 1, title: 'სტანდარტულ ტექსტი' },
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

  public DATA_TYPES: any;

  public DATA_VIEW_TYPES: any;

  public DATA_SOURCE_TYPES: any;

  public DATA_PROPERTY_TYPES: any;


  public newObject = {
    'parent_id': '',
    'source': null,
    'type': null,
    'title': null,
    'data_type': null,
    'data_view': null,
    'is_mandatory': null,
    'has_filter': null,
    'is_primary': null,
  };

  private initNewObject() {
    let cleanObject = {
      'parent_id': '',
      'source': null,
      'type': null,
      'title': null,
      'data_type': null,
      'data_view': null,
      'is_mandatory': null,
      'has_filter': null,
      'is_primary': null,
    };
    this.newObject = cleanObject;
  }


  constructor(
    public attributesService: AttributesService,
    public messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private initializeDataTypes() {
    this.DATA_TYPES = Object.values(this.dataTypesMap);
  }

  private initializeViewTypes() {
    this.DATA_VIEW_TYPES = Object.values(this.viewTypesMap);
  }

  onRowReorder(event: any, id: any, propertyData: any) {
    this.reorderProperties(propertyData, id);
  }

  addProperty(attrID: any) {
    // this.addPropertyButton = !this.addPropertyButton;
    //Add Property Here
    this.attrID = attrID;
    this.newObject.parent_id = this.attrID.toString();
    if (!this.validatePropertyForm()) {
      this.addRecord(attrID, this.newObject);
      this.initNewObject();
    }
  }

  toggleProperty(atrrID: any) {
    this.addPropertyButton = !this.addPropertyButton;
    if (!this.addPropertyButton) {
      this.initNewObject();
    }
  }

  toggleFieldset(type: string, value: boolean) {
    this.fieldsets[type] = value;

    // to close other fieldesets
    for (let key in this.fieldsets) {
      if (key == type) continue;
      this.fieldsets[key] = true;
    }
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
    const oldAttr = this.attributes.find((val) => val.id == attr.id);

    let newAttr = { ...attr };

    newAttr.children = newAttr.tabs = newAttr.properties = newAttr.columns = newAttr.sections = newAttr.tabs = [];

    this.attributesService.updateAttr(attr.id, { 'data': newAttr }).subscribe((data) => {
      const response = data as IResponse;

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

  validatePropertyForm() {
    for (let key in this.newObject) {
      if (key == null || key == '') {
        return false;
      }
    }
    return true;
  }

  private async loadData() {
    this.isLoading = true;
    this.spinner.show();

    await this.loadList();

    this.initializeDataTypes();
    this.initializeViewTypes();
    this.DATA_PROPERTY_TYPES = Object.values(this.propertyTypeMap);
    this.DATA_SOURCE_TYPES = this.attributes.map((attr: MAttribute) => MOption.from(attr.id, attr.title as string));

    this.isLoading = false;
    this.spinner.hide();
  }



  private async loadList() {
    await this.attributesService.requestAttributes();
    const list = this.attributesService.asList();

    this.attributes = list;

    this.list['standard'] = list.filter((i) => i.isStandard());
    this.list['tree'] = list.filter((i) => i.isTree());
    this.list['entity'] = list.filter((i) => i.isEntity());
    console.log(this.list['entity'][0]);
  }

  public getSourceAttrTitle(attrID: number) {
    return this.attributes.find((i) => i.id == attrID)?.title;
  }
}
