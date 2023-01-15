import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MOption } from 'src/services/attributes/models/option.model';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';
import { FormService } from 'src/services/form.service';

@Component({
  standalone: true,
  selector: 'select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css'],
  imports: [CommonModule, FormsModule, DropdownModule]
})
export class SelectInputComponent implements OnInit {
  @Input('property') public property!: MProperty;
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();
  @Input('selected') public selected?: MOption[];

  // public selected: MOption | null = null;
  public style = { "width": "400px", "height": "100%" };
  public initialized: boolean = false;
  public options: any[] = [];

  constructor(private form: FormService) {

  }

  ngOnInit() {
    console.log('Generated Select input');
    console.log(this.selected);

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
    console.log(this.selected);
    if (!this.valid()) {
      this.onChange.emit(null);
      return;
    }

    this.onChange.emit(MPropertyValue.from(this.property, this.selected));
  }


}
