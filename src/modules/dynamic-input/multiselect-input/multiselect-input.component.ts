import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MOption } from 'src/services/attributes/models/option.model';

@Component({
  standalone: true,
  selector: 'multiselect-input',
  templateUrl: './multiselect-input.component.html',
  styleUrls: ['./multiselect-input.component.css'],
  imports: [CommonModule, FormsModule, MultiSelectModule]
})
export class MultiselectInputComponent implements OnInit {
  @Input('property') public property!: MProperty;
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();

  public selected: MOption | MOption[] | null = null;
  public style = { "width": "400px", "height": "100%" };
  public initialized: boolean = false;
  public options: any[] = [];

  constructor(private form: FormService) { }

  ngOnInit() {
    if (!this.property || this.property == null) {
      return;
    }

    this.initialized = true;
  }

  public valid() {
    if (!this.form.validation) {
      return true;
    }

    return this.selected != null && Object.values(this.selected).length > 0;
  }


  public onUpdate() {
    if (!this.valid()) {
      this.onChange.emit(null);
      return;
    }

    this.onChange.emit(MPropertyValue.from(this.property, this.selected));
  }

}
