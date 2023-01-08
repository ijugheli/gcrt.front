import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';
import { MProperty } from '../../../services/attributes/models/property.model';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { FormService } from 'src/services/form.service';
import { EditorModule } from 'primeng/editor';

@Component({
  standalone: true,
  selector: 'plain-input',
  templateUrl: './plain-input.component.html',
  styleUrls: ['./plain-input.component.css'],
  imports: [CommonModule, FormsModule, EditorModule,  InputTextModule, InputNumberModule],
})
export class PlainInputComponent implements OnInit {
  @Input('property') public property!: MProperty;
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();

  public value: any;
  public style = { "width": "400px", "height": "100%" };
  public initialized: boolean = false;

  constructor(private form: FormService) {

  }

  ngOnInit() {
    if (!this.property || this.property == null) {
      return;
    }

    if(this.property.isTextarea()) {
      console.log('SHOULD BE RENDERING TEXTAREA');
    }

    this.initialized = true;
  }

  public onUpdate() {
    if (!this.valid()) {
      this.onChange.emit(null);
      return;
    }

    this.onChange.emit(MPropertyValue.from(this.property, this.value));
  }

  public valid(): boolean {
    if (!this.form.validation) {
      return true;
    }

    return this.value != null && this.value != '';
  }

}
