import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DATA_TYPE_ID } from 'src/app/app.config';
import { AttrProperty, AttrValue } from 'src/app/app.models';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-attribute-form',
  templateUrl: './attribute-form.component.html',
  styleUrls: ['./attribute-form.component.css']
})
export class AttributeFormComponent implements OnInit {


  public attrID: any; //Project
  public valueID: number | null = 0;
  public initialValuesProvided: boolean = false;


  public properties: AttrProperty[] = [];
  public sections: any[] = [];

  public children: any[] = [];

  public values: Map<number, AttrValue | null> = new Map();
  public initialValues: any = {};
  public fields: Map<number, AttrValue | null> = new Map();

  public validation = false;

  value: number = 0;

  constructor(
    private attrsService: AttributesService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    let attrID: any = this.activatedRoute.snapshot.paramMap.get('attr_id');
    this.attrID = attrID == null ? null : parseInt(attrID);

    let valueID: any = this.activatedRoute.snapshot.paramMap.get('value_id');
    this.valueID = valueID == null ? null : parseInt(valueID);

    if (!this.attrID || this.attrID == null) {
      this.router.navigateByUrl('/');
    }

    this.initialValuesProvided = this.valueID != null;
    this.load();
  }

  private load() {
    this.spinner.show();

    if (this.valueID != null) {
      this.attrsService.attributeWithValue(this.attrID, this.valueID)
        .subscribe((data: any) => {
          this.initializeAttribute(data);
          if (data.values) this.setInitialValues(data.values);
          this.spinner.hide();
        });
      return;
    }

    this.attrsService.attribute(this.attrID)
      .subscribe((data: any) => {
        this.initializeAttribute(data);
        this.spinner.hide();
      });
  }

  private initializeAttribute(data: any) {
    this.properties = data.properties;
    if (data.properties) this.initValues(data.properties);
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
          // this.ref.close();
        });

      return;
    }


    this.attrsService
      .addValueCollection(this.attrID, Array.from(this.values.entries()))
      .subscribe((data) => {
        this.spinner.hide();
        // this.ref.close();
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
    // this.ref.close();
  }

}
