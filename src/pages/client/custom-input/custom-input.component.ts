import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeSelectModule } from 'primeng/treeselect';
import { flattenTree, parseTree } from 'src/app/app.func';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { isClientKey } from '../client.model';
import { ClientService } from 'src/services/client.service';
import { CaseService } from 'src/services/case.service';
import { isCaseKey } from 'src/pages/case/case.model';
@Component({
  standalone: true,
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['../client-form/client-form.component.scss'],
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule, InputNumberModule, InputTextareaModule, InputSwitchModule, CalendarModule, TreeSelectModule]
})
export class CustomInputComponent implements OnInit, OnChanges {
  @Input('data') public data!: any;
  @Output('onChange') public onChange = new EventEmitter<any>();
  @Input('model') public model?: any;

  public initialized: boolean = false;
  public options: any;
  public isClientKey: boolean = false;
  public isCaseKey: boolean = false;
  public selectedNodes!: TreeNode[];
  public selectedNode!: TreeNode | undefined;
  public todayDate: Date = new Date();
  public filter!: boolean;

  constructor(
    private attrService: AttributesService,
    public clientService: ClientService,
    public caseService: CaseService,
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data['type'] == 'tree') {
      this.selectedNode = this.getTreeNode(this.model);
    }
  }

  public isInputValid(): boolean {
    if ((!this.data['isRequired'] || !this.clientService.isValidationEnabled) && (!this.data['isRequired'] || !this.caseService.isValidationEnabled)) return true;

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

  public onUpdate(event?: any): void {
    if (this.data['type'] == 'tree') {
      this.selectedNode = this.getTreeNode(event.data.id);
      this.model = event.data.id;
    } else {
      this.model = event;
    }

    if (!this.isInputValid()) {
      this.onChange.emit(null);
      return;
    }

    if (this.isClientKey) {
      this.clientService.values.set(this.data['fieldName'], this.model);
    }

    if (this.isCaseKey) {
      this.caseService.values.set(this.data['fieldName'], this.model);
    }

    this.onChange.emit(this.model);
  }



  public onNodeExpand(event: any): void {
    const node = event.node;
    if (node.children.length > 0) {
      return;
    }
    node.expanded = true;

    this.attrService.treeNodes(this.data['propertyID'], node.data.value_id, true).subscribe((items) => {
      node.children = parseTree(items as any);
      this.options = [...this.options];
      this.saveFlatTreeNodes(node.children);
    });
  }

  // isClientKey/isCaseKey for setting values in appropriate service for validation on submit
  private init(): void {
    this.isClientKey = isClientKey(this.data['fieldName']);
    this.isCaseKey = isCaseKey(this.data['fieldName']);

    if (this.isClientKey) {
      this.clientService.values.set(this.data['fieldName'], this.model);
    }

    if (this.isCaseKey) {
      this.caseService.values.set(this.data['fieldName'], this.model);
    }

    if (this.data['propertyID'] === null) {
      if (this.data['type'] == 'date' && this.model != undefined) {
        this.model = new Date(this.model);
      }
      this.initialized = true;
      return;
    }

    if (this.data['type'] == 'tree') {
      this.initTreeOptions();
      return;
    }


    this.initOptions();
  }

  // dropdownOptionChange listens to data for init
  private initOptions(): void {
    this.attrService.dropdownOptionChange.subscribe(data => {
      this.options = this.attrService.properties.get(this.data['propertyID'])?.source.options;
      this.filter = this.options.length > 5;
    });
    this.initialized = true;

  }

  // treeMapChange listens to data for init
  private initTreeOptions(): void {
    this.attrService.treeMapChange.subscribe((data) => {
      this.options = data.get(this.data['propertyID']);
      this.selectedNode = this.getTreeNode(this.model);
    });
    this.initialized = true;
  }

  // get tree node for setting selectedTreeNode
  private getTreeNode(nodeID: any): TreeNode | undefined {
    if (nodeID == null || this.options === undefined) return;

    return this.attrService.flatTreeMap.get(nodeID) as TreeNode;
  }
  // saving new treenodes for getTreeNode() 
  private saveFlatTreeNodes(items: any): void {
    for (let tree of flattenTree(items)) {
      if (!this.attrService.flatTreeMap.has(tree.data.id)) {
        this.attrService.flatTreeMap.set(tree.data.id, tree);
      }
    }
  }
}
