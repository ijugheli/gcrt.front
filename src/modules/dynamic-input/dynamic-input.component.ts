import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DATA_TYPES, VIEW_TYPES, VIEW_TYPE_ID } from 'src/app/app.config';
import { City } from 'src/app/app.interfaces';
import { AttrProperty, AttrValue } from '../../app/app.models';
import { DATA_TYPE_ID } from '../../app/app.config';

/**
 * Text Input
 * Date Input
 * Attribute Select Input
 * TextArea Input
 * Attribute MultiSelect Input
 */
@Component({
  selector: 'dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent implements OnInit {
  @Input('property') public property!: AttrProperty;
  @Input('validation') public validation: boolean = false;
  @Output('onChange') public onChange = new EventEmitter<AttrValue | null>();

  public viewType: any | null = null;
  public viewTypeID: number | null = null;
  public dataType: any | null = null;
  public dataTypeID: number | null = null;
  public currentValue: any;

  public options: any[];

  public selected: any[] | null = null;

  constructor() {
    this.options = [
    ];
  }

  ngOnInit() {
    this.initViewType();
    this.initDataType();
    this.parseSource();
  }

  public onUpdate(value: any) {
    if (value == null || value == '') {
      this.onChange.emit(null);
      return;
    }

    let object = this.generateValueObject(value);
    console.log(object);
    this.onChange.emit(object);
  }

  private generateValueObject(value: any) {
    let viewTypeID = this.property.input_view_type;
    let dataTypeID = this.property.input_data_type;
    let o = new AttrValue();
    o.attr_id = this.property.attr_id;
    o.property_id = this.property.id;
    o.order_id = this.property.order_id;
    o.related_value_id = null;

    //Value Related
    o.value_integer = null;
    o.value_decimal = null;
    o.value_date = null;
    o.value_json = null;
    o.insert_date = null;
    o.update_date = null;

    //Normal input related -> string|integer|decimal
    if (viewTypeID == VIEW_TYPE_ID('input')) {
      if (dataTypeID == DATA_TYPE_ID('string')) o.value_string = value;
      if (dataTypeID == DATA_TYPE_ID('int')) o.value_integer = value;
      if (dataTypeID == DATA_TYPE_ID('double')) o.value_decimal = value;
    }
    //Checkbox Related.
    if (viewTypeID == VIEW_TYPE_ID('checkbox') ||
      viewTypeID == VIEW_TYPE_ID('toggle')) {
      if (dataTypeID == DATA_TYPE_ID('boolean')) o.value_boolean = value;
    }
    //Dates Related -> date
    else if (viewTypeID == VIEW_TYPE_ID('datepicker') ||
      viewTypeID == VIEW_TYPE_ID('datetimepicker')) {
      if (dataTypeID == DATA_TYPE_ID('date')) o.value_date = value;
      if (dataTypeID == DATA_TYPE_ID('datetime')) o.value_date = value;
    }
    //Textarea related -> text
    else if (viewTypeID == VIEW_TYPE_ID('textarea') ||
      viewTypeID == VIEW_TYPE_ID('editable-textarea')) {
      o.value_text = value;
    }
    //Selects Related -> JSON
    else if (viewTypeID == VIEW_TYPE_ID('select') ||
      viewTypeID == VIEW_TYPE_ID('multiselect') ||
      viewTypeID == VIEW_TYPE_ID('treeselect') ||
      viewTypeID == VIEW_TYPE_ID('tableselect')) {
      // value = value.map((item: any) => {
      //   return item.code;
      // });
      o.value_json = JSON.stringify(value);
    }

    return o;
  }

  private initViewType() {
    this.viewTypeID = this.property.input_view_type as number;
    this.viewType = VIEW_TYPES.has(this.viewTypeID)
      ? VIEW_TYPES.get(this.viewTypeID)
      : null;
  }

  private initDataType() {
    this.dataTypeID = this.property.input_data_type as number;
    this.dataType = DATA_TYPES.has(this.dataTypeID)
      ? DATA_TYPES.get(this.dataTypeID)
      : null;
  }

  public parseSource() {
    if (this.property.source_attr_id == null ||
      !this.property.source ||
      this.property.source.length <= 0) {
      return;
    }

    //@TODO handles only value_string for selects and subselects.
    this.options = this.property.source.map((item: any) => {
      return { name: item.value, id: item.id };
    });
    // console.log(this.o);
  }

  public isValid() {
    if (!this.validation || !this.property.is_mandatory) {
      return true;
    }

    if (this.isSelect()) {
      return this.selected && this.selected.length;
    }

    return this.currentValue != null && this.currentValue != '';
  }

  public isSelect() {
    return this.viewType == 'multiselect' || this.viewType == 'select';
  }

}
