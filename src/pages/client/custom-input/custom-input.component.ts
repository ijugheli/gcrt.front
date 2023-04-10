import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeSelectModule } from 'primeng/treeselect';
import { ATTR_TYPES } from 'src/app/app.config';
import { flattenTree } from 'src/app/app.func';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
import { MCaseSection } from 'src/pages/case/case.model';
import { AttributesService } from 'src/services/attributes/Attributes.service';

@Component({
  standalone: true,
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['../client-form/client-form.component.scss'],
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule, InputNumberModule, InputTextareaModule, InputSwitchModule, CalendarModule, TreeSelectModule]
})
export class CustomInputComponent implements OnInit {
  @Input('data') public data!: any;
  @Output('onChange') public onChange = new EventEmitter<any>();
  @Input('model') public model?: any;

  private validation: boolean = false;
  public initialized: boolean = false;
  public options: any;
  public selectedNodes!: TreeNode[];
  public selectedNode!: TreeNode | undefined;
  public todayDate = new Date();
  public filter!: boolean;

  constructor(private attrService: AttributesService) { }

  ngOnInit() {
    if (this.data['propertyID'] === null) {
      this.initialized = true;
      return;
    }

    if (this.data['type'] == 'tree') {
      this.attrService
        .full(this.data['propertyID'], true)
        .subscribe((d) => this.receiveResponse(d));

      this.initialized = true;
      return;
    }

    this.options = this.attrService.properties.get(this.data['propertyID'])?.source.options;
    this.filter = this.options.length > 5;
    this.initialized = true;
  }

  public valid() {
    if (!this.data['isRequired'] || !this.validation) return true;

    switch (this.data['type']) {
      case 'dropdown':
        return this.model != null;
      case 'date':
        return this.model != null;
      default:
        return this.model !== null &&
          this.model !== '' &&
          this.model !== undefined;
    }
  }


  public onUpdate(event?: any) {
    if (this.data['type'] == 'tree') {
      // const selectedNodeIDs = event.map((e: any) => e.data.id);
      // this.selectedNodes = this.getTreeNodes(selectedNodeIDs);
      // this.model = selectedNodeIDs;

      console.log(event);
      this.selectedNode = this.getTreeNode(event.data.id);
      this.model = event.data.id;
    } else {
      this.model = event;
    }

    this.validation = true;

    if (!this.valid()) {
      this.onChange.emit(null);
      return;
    }

    this.onChange.emit(this.model);
  }

  public getTreeNode(nodeID: any[]): TreeNode | undefined {
    if (nodeID == null || this.options === undefined) return;

    // return flattenTree(this.options).filter(e => ids.includes(e.data.id));
    return (this.options as TreeNode[]).filter(e => nodeID == e.data.id)[0] as TreeNode;
  }


  private receiveResponse(response: APIResponse<Attribute[]>) {
    const attribute: Attribute[] = response.data!;

    this.processAttribute(attribute);
  }

  private processAttribute(data: any,) {
    if (!data || typeof data['type'] == 'undefined' || data['type'] == undefined) {
      return;
    }

    const isTree = data['type'] && data['type'] == ATTR_TYPES.get('tree');

    if (isTree) {
      this.options = this.attrService.parseTree(data['tree']);


      // console.log(this.options);
      // const rame = this.parseee(data['tree']);
      // console.log(rame);
      // if (this.model !== undefined) {
      //   this.selectedNodes = flattenTree(this.options).filter(e => this.model.includes(e.data.id));
      // }

      return;
    }
  }

  // private parseee(tree: any[]) {
  //   return (Array.from(Object.values(tree)) as TreeNode[])
  //     .filter((item) => {
  //       return item.data != undefined && item.data != null;
  //     })
  //     .map((node: any) => {
  //       const temp = new MCaseSection();
  //       if (node.children) {
  //         temp.children = this.parseee(node.children);
  //       }
  //       temp.p_value_id = node.data.p_value_id;
  //       temp.value_id = node.data.value_id;
  //       temp.title = node.data.title;

  //       return temp;
  //     });

  // }
  public onNodeExpand(event: any) {
    const node = event.node;
    if (node.children.length > 0) {
      return;
    }

    this.attrService.treeNodes(this.data['propertyID'], node.data.value_id, true).subscribe((items) => {
      node.children = this.attrService.parseTree(items);
      this.options = [...this.options];
      node.expanded = true;
    });
  }


}
