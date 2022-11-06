import { Component, OnInit } from '@angular/core';
import { Attribute } from 'src/app/app.models';
import { AttributesService } from '../../services/Attributes.service';
import { AttrValue, AttrProperty } from '../../app/app.models';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  public attrID = 5; //Project
  public properties: AttrProperty[] = [];
  public sections: any[] = [];

  public values: Map<number, AttrValue | null> = new Map();
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
    this.load();
  }

  private load() {
    this.spinner.show();
    this.attrsService.attribute(this.attrID)
      .subscribe((data: any) => {
        this.properties = data.properties;
        this.initValues(data.properties);
        this.parseProperties(data.properties);
        this.spinner.hide();
      });
  }

  public onValueUpdate(propertyID: number, e: AttrValue | null) {
    this.validation = false;
    if (!propertyID || !this.values.has(propertyID)) {
      return;
    }

    this.values.set(propertyID, e);
    // console.log(this.values);
  }

  private initValues(properties: any[]) {
    properties.forEach((property: AttrProperty) => {
      if (property.id) this.values.set(property.id, null);
    });
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

  public onSubmit() {
    console.log('------REQUESST------');

    if (!this.validate()) {
      return;
    }

    this.spinner.show();
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

      return !property.is_mandatory ||
        (property.is_mandatory &&
          this.values.get(property.id) != null);
    }

    return false;
  }


  public onCancel() {
    this.ref.close();
  }

}
