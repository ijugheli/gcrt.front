import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormService } from 'src/services/form.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';

@Component({
  standalone: true,
  selector: 'date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
  providers: [FormService],
  imports: [CommonModule, FormsModule, CalendarModule],
})
export class DateInputComponent implements OnInit {
  @Input('property') public property!: MProperty;
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();


  public value: any;
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
