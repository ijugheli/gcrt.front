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
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';
import { FormService } from '../../services/form.service';

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
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();

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


  constructor(
    public attributes: AttributesService,
    public form: FormService,
  ) {
    this.options = [];
  }

  ngOnInit() {
    this.parseSource();
  }

  public enabled() {
    if (!this.property) {
      return false;
    }

    if (!this.property.isGenerated()) {
      return true;
    }

    return this.form.generatedPropertyEnabled(this.property);
  }




  public onUpdate(propertyValue: MPropertyValue | null) {
    this.onChange.emit(propertyValue);
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
    this.attributes.treeNodes(this.property.source_attr_id, node.data.value_id).subscribe((items) => {
      node.children = this.parseTree(items);
      this.tree = [...this.tree];
      this.loading = false;
      node.expanded = true;
    });
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
