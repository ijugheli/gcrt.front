import { Component, OnInit } from '@angular/core';
import { Attribute } from 'src/app/app.models';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { AttrValue } from '../../app/app.models';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from "ngx-spinner";
import { DATA_TYPE_ID } from '../../app/app.config';
import { MProperty } from '../../services/attributes/models/property.model';
import { FormService } from '../../services/form.service';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';


@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  //@TODO initialize attrID properly
  public attrID = 5; //Project
  //Value for editing 
  public valueID: number | null = 0;
  //Parent value for tree nodes
  public preDefined: any[] | null = null;
  public relatedValueID: number | null = null;
  public initialValuesProvided: boolean = false;


  public sections: any[] = [];

  public children: any[] = [];

  public values: Map<number | string, MPropertyValue | null | number> = new Map();
  public initialValues: any = {};
  public fields: Map<number, AttrValue | null> = new Map();

  public validation = false;

  value: number = 0;


  public properties: MProperty[] = [];

  constructor(
    private attrsService: AttributesService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private spinner: NgxSpinnerService,
    private form: FormService,
  ) { }

  ngOnInit() {
    //Attribute ID for form generation
    this.attrID = this.config.data.attrID;
    //ValueID for editing mode.
    this.valueID = this.config.data?.valueID;
    //preDefined for adding/editing tree values.
    this.preDefined = this.config.data?.preDefined;

    if (this.preDefined) {
      console.log('Predefined Value for Dynamic form');
      console.log(this.preDefined);
      console.log('Predefined Value for Dynamic form');
    }

    //Related value ID for sub entities
    this.relatedValueID = this.config.data?.relatedValueID;
    //if we are in editing mode we should have initial values provided
    this.initialValuesProvided = this.valueID != null;

    this.load();
  }

  private load() {


    // this.spinner.show();

    //For editing provided value.
    if (this.valueID != null) {
      this.attrsService.attributeWithValue(this.attrID, this.valueID)
        .subscribe((data: any) => {
          this.initializeAttribute(data);
          if (data.values) this.setInitialValues(data.values);
          this.spinner.hide();
        });
      return;
    }

    // this.spinner.hide();
    // console.log(attribute. );
    // this.attrsService.attribute(this.attrID)
    //   .subscribe((data: any) => {
    //     this.initializeAttribute(data);
    //     this.spinner.hide();
    //   });


    /////////BODY//////////////
    let attribute = this.attrsService.find(this.attrID);
    if (attribute == null) return;

    this.properties = attribute.properties;
    this.sections = attribute.sections;
    this.initValues();
    /////////BODY//////////////


  }

  private initializeAttribute(data: any) {
    this.properties = data.properties;
    // if (data.properties) this.initValues(data.properties);
    if (data.children) this.initChildren(data.children);
    if (data.properties) this.parseProperties(data.properties);
  }

  private initChildren(children: any[]) {
    this.children = children;
    if (this.children.length > 0) {
      this.children.splice(0, 0, {
        'title': 'მონაცემები',
        'id': 3
      })
    }

    console.log(this.children);
  }

  //Initializers
  private initValues() {
    this.properties.forEach((property: MProperty) => {
      if (property.id) this.values.set(property.id, null);
    });
  }

  private setInitialValues(values: any) {
    for (let propertyID in values) {
      this.initialValues[propertyID] = values[propertyID][values[propertyID]['value_name']];
    }
  }

  private parseProperties(properties: any[]) {
    this.sections = properties
      .sort((a, b) => a.order_id > b.order_id ? 1 : -1)
      .filter((i) => i.type == 2);

    if (this.sections.length <= 0) {
      this.sections = [
        {
          'properties': properties.sort((a, b) => a.order_id > b.order_id ? 1 : -1),
          'title': 'მახასიათებლები',
        },
      ];
      return;

    }
    this.sections = this.sections.map((section) => {
      section['properties'] = properties
        .filter((j) => j.p_id == section.id)
        .sort((a, b) => a.order_id > b.order_id ? 1 : -1);
      //Adds input if there is no subs
      if (section['properties'].length == 0) {
        section['properties'] = [section];
      }
      return section;
    });

    // if(this.sections.length)
  }

  ////////////////////////////////////Form Related////////////////////////////////////
  public onValueUpdate(propertyID: number, e: MPropertyValue | null) {
    this.validation = false;
    console.log('Provided Value is');
    console.log(propertyID);
    console.log(e);
    console.log('Provided Value is');
    if (!propertyID || !this.values.has(propertyID)) {
      return;
    }

    this.values.set(propertyID, e);
  }

  private applyField(field: any) {
    this.values.forEach((value: any, key) => {
      if (value && field && field['key'] && field['value'])
        value[field['key']] = field['value'];
      this.values.set(key, value);
    });
  }

  private appendField(field: any) {
    this.values.set(field['key'], field.value);
  }

  private appendPreDefined() {
    if (this.preDefined == null) {
      return;
    }
    for (let i = 0; i < this.preDefined.length; i++) {
      let item = this.preDefined[i];
      if (item['type'] == 'apply') this.applyField(item);
      if (item['type'] == 'append') this.appendField(item);
    }

  }

  private appendRelated() {
    if (this.relatedValueID != null) {
      this.values.set('related_value_id', this.relatedValueID);
    }
  }


  public onSubmit() {
    console.log('Submitted Values are');
    console.log(this.values);
    console.log('Submitted Values are');
    this.form.enableValidation();
    if (!this.validate()) {
      return;
    }

    // this.appendRelated();
    // this.appendPreDefined();
    const object = Array.from(this.values.entries());


    console.log(object);
    // return;

    // if (this.valueID != null) {
    //   this.spinner.show();
    //   this.attrsService
    //     .editValueCollection(this.attrID, this.valueID, object)
    //     .subscribe((data) => {
    //       this.spinner.hide();
    //       this.ref.close();
    //     });

    //   return;
    // }

    this.spinner.show();
    this.attrsService
      .addValueCollection(this.attrID, object)
      .subscribe((data) => {
        this.spinner.hide();
        this.ref.close();
      });
  }

  private validate(): boolean {
    let invalids = this.properties.filter((property: MProperty) => {
      if (property.isSection()) return false;
      if (!property.mandatory()) return false;

      return this.values.get(property.id) === null;
    });

    console.log('Invalids');
    console.log(invalids);
    console.log('Invalids');

    return invalids.length <= 0;
  }

  public onCancel() {
    this.ref.close();
  }

}
