import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { DATA_TYPES } from 'src/app/app.config';
import { reverseMap } from 'src/app/app.func';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MOption } from '../../services/attributes/models/option.model';

@Component({
  selector: 'app-attributes-structure',
  templateUrl: './attributes-structure.component.html',
  styleUrls: ['./attributes-structure.component.css']
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
    1: { name: 'int', id: 1, title: 'სტანდარტული'},
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
    'parent_id' : '',
    'source' : null,
    'type' : null,
    'title' : null,
    'data_type' : null,
    'data_view' : null,
    'is_mandatory' : null,
    'has_filter' : null,
    'is_primary' : null,
  };

  private initNewObject() {
    let cleanObject = {
      'parent_id' : '',
      'source' : null,
      'type' : null,
      'title' : null,
      'data_type' : null,
      'data_view' : null,
      'is_mandatory' : null,
      'has_filter' : null,
      'is_primary' : null,
    };
    this.newObject = cleanObject;
  }


  constructor(public attributes: AttributesService) { }

  ngOnInit() {
    this.list = this.attributes.asList();
    this.initializeDataTypes();
    this.initializeViewTypes();
    this.DATA_PROPERTY_TYPES = Object.values(this.propertyTypeMap);
    this.DATA_SOURCE_TYPES = this.list.map((attr: MAttribute) => MOption.from(attr.id, attr.title as string));
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

  onRowReorder(event: any, id: any) {
    //TODO 
    //Implement Order ID change
    console.log(event, 'Event We are looking for');
    console.log(id, 'id We are looking for');

  }

  addProperty(attrID: any) {
    // this.addPropertyButton = !this.addPropertyButton;
    //Add Property Here
    this.attrID = attrID;
    this.newObject.parent_id = this.attrID.toString();
    this.validatePropertyForm();
    if(!this.validatePropertyForm) {
      console.log('Im here');
      this.initNewObject();
    }

  }

  toggleProperty(atrrID: any) {
    this.addPropertyButton = !this.addPropertyButton;
 
  }


  validatePropertyForm() {
    for(let key in this.newObject) {
      if(key == null || key == '') {
        return false;
      } 
      
    }
    return true;
  }

}
