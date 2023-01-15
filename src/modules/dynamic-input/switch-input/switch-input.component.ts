import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';
import { FormService } from 'src/services/form.service';

@Component({
  standalone: true,
  selector: 'switch-input',
  templateUrl: './switch-input.component.html',
  styleUrls: ['./switch-input.component.css'],
  imports: [CommonModule, FormsModule, InputSwitchModule],

})
export class SwitchInputComponent implements OnInit {
  @Input('property') public property!: MProperty;
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();
  @Input('value') public value?: any;

  public style = { "width": "400px", "height": "100%" };
  public initialized: boolean = false;

  constructor(private form: FormService) { }

  ngOnInit() {
    if (!this.property || this.property == null) {
      return;
    }

    this.initialized = true;
  }

  public valid(): boolean {
    if (!this.form.validation) {
      return true;
    }

    return this.value != null && this.value != '';
  }

  public onUpdate() {
    if (!this.valid()) {
      this.onChange.emit(null);
      return;
    }

    this.onChange.emit(MPropertyValue.from(this.property, this.value));
  }

}
