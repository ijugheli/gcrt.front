import { Injectable } from '@angular/core';
import { DynamicFormModule } from 'src/modules/dynamic-form/dynamic-form.module';

@Injectable({
  providedIn: 'any'
})
export class FormService {
  public validation : boolean = false;

  
  constructor() { }

    
  public enableValidation(){ 
    this.validation = true;
  }

  public disableValidation() {
    this.validation = false;
  }



}
