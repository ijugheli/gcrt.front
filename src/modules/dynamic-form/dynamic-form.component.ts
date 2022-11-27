import { Component, OnInit } from '@angular/core';
import { Attribute } from 'src/app/app.models';
import { AttributesService } from '../../services/Attributes.service';
import { AttrValue, AttrProperty } from '../../app/app.models';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem } from 'primeng/api/menuitem';
import { DATA_TYPE_ID } from '../../app/app.config';


@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  public attrID = 5; //Project
  public valueID: number | null = 0;
  public initialValuesProvided: boolean = false;


  public properties: AttrProperty[] = [];
  public sections: any[] = [];

  public values: Map<number, AttrValue | null> = new Map();
  public initialValues: any = {};
  public fields: Map<number, AttrValue | null> = new Map();

  public validation = false;

  value: number = 0;

  constructor(
    private attrsService: AttributesService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.attrID = this.config.data.attrID;
    this.valueID = this.config.data?.valueID;
    this.initialValuesProvided = this.valueID != null;
    this.load();

  }

  private load() {
    this.spinner.show();

    if (this.valueID != null) {
      this.attrsService.attributeWithValue(this.attrID, this.valueID)
        .subscribe((data: any) => {
          this.properties = data.properties;
          this.initValues(data.properties);
          this.parseProperties(data.properties);
          this.setInitialValues(data.values);
          this.spinner.hide();
        });
      return;
    }

    this.attrsService.attribute(this.attrID)
      .subscribe((data: any) => {
        this.properties = data.properties;
        this.initValues(data.properties);
        this.parseProperties(data.properties);
        this.spinner.hide();
      });



  }


  //Initializers
  private initValues(properties: any[]) {
    properties.forEach((property: AttrProperty) => {
      if (property.id) this.values.set(property.id, null);
    });
  }

  private setInitialValues(values: any) {
    for (let propertyID in values) {
      this.initialValues[propertyID] = values[propertyID][values[propertyID]['value_name']];
    }
    console.log(this.initialValues);
  }

  private parseProperties(properties: any[]) {
    this.sections = properties
      .sort((a, b) => a.order_id > b.order_id ? 1 : -1)
      .filter((i) => i.p_id == 0)
      .map((section) => {
        section['properties'] = properties
          .filter((j) => j.p_id == section.id)
          .sort((a, b) => a.order_id > b.order_id ? 1 : -1);

        if (section['properties'].length == 0) {
          section['properties'] = [section];
        }
        return section;
      });
  }








  ////////////////////////////////////Form Related////////////////////////////////////
  public onValueUpdate(propertyID: number, e: AttrValue | null) {
    this.validation = false;
    if (!propertyID || !this.values.has(propertyID)) {
      return;
    }
    // console.log(e);
    this.values.set(propertyID, e);
  }
  public onSubmit() {
    if (!this.validate()) {
      return;
    }

    if (this.valueID != null) {
      this.spinner.show();
      this.attrsService
        .editValueCollection(this.attrID, this.valueID, Array.from(this.values.entries()))
        .subscribe((data) => {
          this.spinner.hide();
          this.ref.close();
        });

      return;
    }


    this.attrsService
      .addValueCollection(this.attrID, Array.from(this.values.entries()))
      .subscribe((data) => {
        this.spinner.hide();
        this.ref.close();
      });
  }

  private validate(): boolean {
    this.validation = true;
    return this.isFormValid();
  }

  private isFormValid(): boolean {
    for (let k = 0; k < this.properties.length; k++) {
      let property = this.properties[k] as AttrProperty;

      if (!property.id)
        continue;

      console.log(this.values);
      let isValid = property.input_data_type == DATA_TYPE_ID('boolean') || property.type == 2 || !property.is_mandatory ||
        (property.is_mandatory &&
          this.values.get(property.id) != null);

      if (property.is_mandatory && !isValid && property.input_data_type !== DATA_TYPE_ID('boolean')) {
        console.log(property.title);
        console.log(this.values.get(property.id));
        console.log(property);
      }

      if (!isValid)
        return false;
      // return isValid;
    }

    return true;
  }

  public onCancel() {
    this.ref.close();
  }

}
