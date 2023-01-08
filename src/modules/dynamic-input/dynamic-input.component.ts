import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DATA_TYPES, VIEW_TYPES, VIEW_TYPE_ID } from 'src/app/app.config';
import { City } from 'src/app/app.interfaces';
import { AttrProperty, AttrValue } from '../../app/app.models';
import { DATA_TYPE_ID } from '../../app/app.config';
import { TreeNode } from 'primeng/api';
import { parse, stringify, toJSON, fromJSON } from 'flatted';
import { clone } from 'src/app/app.func';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { PlainInputComponent } from './plain-input/plain-input.component';
import { MProperty } from 'src/services/attributes/models/property.model';

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
  styleUrls: ['./dynamic-input.component.css'],
})
export class DynamicInputComponent implements OnInit {
  // @Input('property') public property!: AttrProperty;
  @Input('property') public property!: MProperty;
  @Input('validation') public validation: boolean = false;
  @Input('initialValue') public initialValue: any;
  @Output('onChange') public onChange = new EventEmitter<AttrValue | null>();

  public viewType: any | null = null;
  public viewTypeID: number | null = null;
  public dataType: any | null = null;
  public dataTypeID: number | null = null;
  public currentValue: any;

  public options: any[];
  public tree: any;

  public selected: any[] = [];
  public treeSelected: any[] = [];

  public loading: boolean = false;


  constructor(private attrsService: AttributesService) {
    this.options = [];
  }

  ngOnInit() {
    console.log('Provided Property in dynamic input is');
    console.log(this.property);
    console.log('Provided Property in dynamic input is');

    this.initViewType();
    this.initDataType();
    this.parseSource();
    this.loadInitialValue();
  }

  public onNodeExpand(event: any) {
    const node = event.node;
    if (node.children.length > 0) {
      return;
    }

    if (this.property.source_attr_id == null) {
      return;
    }

    this.loading = true;
    this.attrsService.treeNodes(this.property.source_attr_id, node.data.value_id).subscribe((items) => {
      node.children = this.parseTree(items);
      this.tree = [...this.tree];
      this.loading = false;
      node.expanded = true;
    });
  }

  private loadInitialValue() {
    if (this.initialValue == null) {
      return;
    }

    if (this.isTree()) {
      this.selected = JSON.parse(this.initialValue);
      this.onUpdate(this.selected);
      return;
    }

    if (this.isSelect()) {
      this.selected = JSON.parse(this.initialValue);
      this.selected = this.viewType == 'multiselect' ? Array.from(this.selected) : this.selected;
      this.onUpdate(this.selected);
      return;
    }

    if (this.property.input_data_type == DATA_TYPE_ID('date') ||
      this.property.input_data_type == DATA_TYPE_ID('datetime')) {
      this.currentValue = new Date(this.initialValue);
      this.onUpdate(this.currentValue);
      return;
    }

    if (this.property.input_data_type == DATA_TYPE_ID('boolean')) {
      this.currentValue = this.initialValue != null && this.initialValue == 1 ? true : false;
      this.onUpdate(this.currentValue);
      return;
    }

    this.currentValue = this.initialValue;

    this.onUpdate(this.currentValue);

    return;
  }

  public onUpdate(value: any) {
    if (value == null || value == '') {
      this.onChange.emit(null);
      return;
    }

    let object = this.generateValueObject(value);

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
    // o.RelatedValueID = 123;


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
      viewTypeID == VIEW_TYPE_ID('tableselect')) {

      o.value_json = JSON.stringify(value);
    } else if (viewTypeID == VIEW_TYPE_ID('treeselect')) {
      const sanitizedJSON = Object.assign({}, value);

      if (sanitizedJSON.parent) {
        if (sanitizedJSON.parent.children) {
          for (let i = 0; i < sanitizedJSON.parent.children.length; i++) {
            sanitizedJSON.parent.children[i]['parent'] = null;
          }
        }
      }

      o.value_json = JSON.stringify(sanitizedJSON);
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
    if (this.property.source_attr_id == null) {
      return;
    }

    //@TODO handles only value_string for selects and subselects.
    if (this.property.tree != null) {
      this.tree = this.parseTree(this.property.tree);
    }

    // if (this.property.source)
    //   this.options = this.property.source.map((item: any) => {
    //     return { name: item.value, id: item.id };
    //   });

    console.log(this.options);
  }

  private parseTree(tree: any) {
    return (Array.from(Object.values(tree)) as TreeNode[])
      .filter((item) => {
        return item.data != undefined && item.data != null;
      })
      .map((node: any) => {
        if (node.children) {
          node.children = this.parseTree(node.children);
        }
        node.label;
        node.id = node.data.value_id;

        return node;
      });
  }

  public isValid() {
    if (!this.validation || !this.property.is_mandatory) {
      return true;
    }
    if (this.isSelect()) {
      return this.selected != null && Object.values(this.selected).length > 0;
    }

    return this.currentValue != null && this.currentValue != '';
  }

  public isSelect() {
    return this.viewType == 'multiselect' || this.viewType == 'select';
  }

  public isTree() {
    return this.viewType == 'treeselect';
  }

}
