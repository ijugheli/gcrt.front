import { Injectable } from '@angular/core';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';
import { MRecord } from './attributes/models/record.model';
import { MAttribute } from './attributes/models/attribute.model';
import { MPropertyValue } from './attributes/models/property.value.model';
import { MProperty } from './attributes/models/property.model';
import { RecordsService } from './attributes/Records.service';

@Injectable({
  providedIn: 'any'
})
export class FormService {
  public validation: boolean = false;
  public record?: MRecord;
  public attribute?: MAttribute;

  public values: Map<number | string, MPropertyValue | null | number> = new Map();
  public initials: any = {};

  constructor(public records: RecordsService) { }

  public withAttribute(attribute: MAttribute) {
    this.attribute = attribute;
    this.initialize();
    return this;
  }

  public withRecord(record: MRecord) {
    this.record = record;
    this.attribute = this.record.attribute;
    this.initialize();
  }

  private initialize() {
    if (!this.attribute)
      return;

    this.values = new Map();
    this.initials = {};

    this.attribute.properties.forEach((property: MProperty) => {
      if (property.id) this.values.set(property.id, null);
    });

    if (!this.record) return;

    for (let propID in this.record.propValueMap) {
      let propertyID = parseInt(propID);
      const simpleValue = this.record.formValueMap[propertyID];
      const value = this.record.map.get(propertyID);
      if (!value) continue;

      this.initials[propertyID] = simpleValue ? simpleValue : '';
      this.values.set(propertyID, value);
    }
  }

  public initialsProvided(): boolean {
    return this.record != null && this.record != undefined && this.initials != null && this.initials != undefined;
  }

  public onValueUpdate(propertyID: number, e: MPropertyValue | null) {

    this.validation = false;
    console.log('Trying to update value');
    if (!propertyID || !this.values.has(propertyID)) {
      return;
    }

    this.values.set(propertyID, e);
    console.log('VALUE UPDATED');
    console.log(this.values);
    console.log('VALUE UPDATED');
  }

  private validate(): boolean {
    if (!this.attribute) return false;

    let invalids = this.attribute.properties.filter((property: MProperty) => {
      if (property.isSection()) return false;
      if (property.isCheckbox()) return false;
      if (!property.mandatory()) return false;

      return this.values.get(property.id) === null || this.values.get(property.id) === undefined;
    });

    return invalids.length <= 0;
  }

  public async onSubmit(before: Function, after: Function) {
    if (!this.attribute) return;
    this.enableValidation();

    if (!this.validate()) {
      return;
    }

    // this.appendRelated();
    // this.appendPreDefined();
    const object = Array.from(this.values.entries());
    console.log(object);
    
    if (this.initialsProvided() && this.record) {
      await this.records.edit(this.attribute.id, this.record.valueID, object, after);
      return;
    }

    await this.records.add(this.attribute.id, object, after);
  }


  public clear() {
    this.record = undefined;
  }

  public enableValidation() {
    this.validation = true;
  }

  public disableValidation() {
    this.validation = false;
  }


  public generatedPropertyEnabled(property: MProperty) {
    let targetID = property.generated_by;

    if (!targetID) {
      return
    }

    let target = this.values.get(targetID);

    if (target == null || target == undefined) {
      return false;
    }

    if (property.switchGenerated() && target instanceof MPropertyValue) {
      return target.value_boolean == null ? false : target.value_boolean;
    }

    console.log('-------------Checking generated---------------');
    return false;
  }



}
