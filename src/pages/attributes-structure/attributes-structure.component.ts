import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MOption } from '../../services/attributes/models/option.model';
import { IResponse } from 'src/app/app.interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-attributes-structure',
  templateUrl: './attributes-structure.component.html',
  styleUrls: ['./attributes-structure.component.css'],
  providers: [MessageService]
})

export class AttributesStructureComponent implements OnInit {
  public addPropertyButton = false;
  public attrID = 0;
  public list: MAttribute[] = [];
  public addPropertiesData: MProperty = new MProperty();
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

  public DATA_TYPES: any;

  public DATA_VIEW_TYPES: any;

  public DATA_SOURCE_TYPES: any;

  public DATA_PROPERTY_TYPES: any;

  public selectedPropViewTypes: { [index: number]: any } = {};

  public selectedPropTypes: { [index: number]: any } = {};


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
  ) { }

  ngOnInit() {
    this.list = this.attributesService.asList();
    this.initializeDataTypes();
    this.initializeViewTypes();
    this.DATA_PROPERTY_TYPES = Object.values(this.propertyTypeMap);
    this.DATA_SOURCE_TYPES = this.list.map((attr: MAttribute) => MOption.from(attr.id, attr.title as string));
    console.log(this.list[0].properties[0].title);
  }

  private initializeDataTypes() {
    this.DATA_TYPES = Object.values(this.dataTypesMap);
    this.list.forEach((attribute: MAttribute) => {
      this.selectedPropTypes[attribute.id] = {};
      attribute.properties.forEach((property: MProperty) => {
        this.selectedPropTypes[attribute.id][property.id] = this.dataTypesMap[property.input_data_type];
      });
    });
  }

  private initializeViewTypes() {
    this.DATA_VIEW_TYPES = Object.values(this.viewTypesMap);
    this.list.forEach((attribute: MAttribute) => {
      this.selectedPropViewTypes[attribute.id] = {};
      attribute.properties.forEach((property: MProperty) => {
        this.selectedPropViewTypes[attribute.id][property.id] = this.viewTypesMap[property.input_view_type];
      });
    });
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


  public addRecord(attrID: number, data: any) {
    // this.spinner.show();
    this.attributesService.addProperty(attrID, data);

  }

  public reorderProperties(data: any, attrID: number) {
    let propertyIDs = [];
    for (let i in data) {
      propertyIDs.push(data[i]['id']);
    }
    this.attributesService.reorderProperties(attrID, JSON.stringify(propertyIDs));
    this.list = this.attributesService.asList();
  }

  //columnType lazy 0  statusID 1
  public updateLazyOrStatusID(attrID: number, isLazy: boolean, value: boolean) {
    const oldAttr = this.list.find((val) => val.id == attrID);

    this.attributesService.updateLazyOrStatusID(attrID, { 'is_lazy': isLazy, 'value': value }).subscribe((data) => {
      const response = data as IResponse;

      if (!response.code) {
        this.showError(response.message);
        this.restoreOldValue(oldAttr!, value, isLazy);
        return;
      }
      this.showSuccess(response.message);
    }, (error) => {
      this.showError('დაფიქსირდა შეცდომა');

      this.restoreOldValue(oldAttr!, value, isLazy);
    });
  }


  public updateProperty(propertyID: number, property: MProperty) {
    this.attributesService.updateProperty(propertyID, property).subscribe((data) => {
      console.log(data.message);
    } )
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

}
