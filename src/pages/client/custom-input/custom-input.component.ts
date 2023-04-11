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
import { ATTR_TYPES, VIEW_TYPE_ID } from 'src/app/app.config';
import { flattenTree, parseTree } from 'src/app/app.func';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
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
    this.init();
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

    return (this.options as TreeNode[]).filter(e => nodeID == e.data.id)[0] as TreeNode;
  }

  public onNodeExpand(event: any) {
    const node = event.node;
    if (node.children.length > 0) {
      return;
    }
    node.expanded = true;

    this.attrService.treeNodes(this.data['propertyID'], node.data.value_id, true).subscribe((items) => {
      node.children = parseTree(items as any);
      this.options = [...this.options];
    });
  }

  private init() {
    if (this.data['propertyID'] === null) {
      this.initialized = true;
      return;
    }

    if (this.data['type'] == 'tree') {
      this.initTreeOptions();
      return;
    }

    this.initOptions();
  }

  private initOptions(): void {
    this.options = this.attrService.properties.get(this.data['propertyID'])?.source.options;

    this.filter = this.options.length > 5;
    this.initialized = true;
  }

  private initTreeOptions(): void {
    this.attrService
      .full(this.data['propertyID'], true)
      .subscribe((d) => this.parseTreeOptions(d));

    this.initialized = true;
  }

  private parseTreeOptions(response: APIResponse<Attribute[]>) {
    const attribute: any = response.data!;

    this.options = parseTree(attribute['tree']);
  }
}
