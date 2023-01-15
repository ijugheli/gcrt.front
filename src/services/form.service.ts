import { Injectable } from '@angular/core';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';
import { MRecord } from './attributes/models/record.model';

@Injectable({
  providedIn: 'any'
})
export class FormService {
  public validation: boolean = false;

  public record?: MRecord;

  constructor() { }

  public withRecord(record: MRecord) {
    this.record = record;
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



}
