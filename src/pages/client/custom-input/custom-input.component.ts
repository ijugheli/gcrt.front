import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeSelectModule } from 'primeng/treeselect';
import { flattenTree, formatDate, parseTree } from 'src/app/app.func';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { isClientKey } from '../client.model';
import { ClientService } from 'src/services/client.service';
import { CaseService } from 'src/services/case.service';
import { isCaseKey } from 'src/pages/case/case.model';
import { ICustomInput } from 'src/app/app.interfaces';
import { switchMap, map, Subject, takeUntil } from 'rxjs';
import { MOption } from 'src/services/attributes/models/option.model';
import * as _ from 'lodash';
@Component({
  standalone: true,
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule, InputNumberModule, InputTextareaModule, InputSwitchModule, CalendarModule, TreeSelectModule]
})
export class CustomInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public data!: any;
  @Input() public isTableInput: boolean = false;
  @Input() public isDisabled: boolean = false;
  @Input() public model?: any;
  @Output() public onChange = new EventEmitter<any>();

  public initialized: boolean = false;
  public options: any;
  public isClientKey: boolean = false;
  public isCaseKey: boolean = false;
  public selectedNodes!: TreeNode[];
  public selectedNode!: TreeNode | undefined;
  public todayDate: Date = new Date();
  public hasFilter!: boolean;
  private onDestroy$: Subject<any> = new Subject();

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

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
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
    if (this.data['type'] === 'tree') {
      this.selectedNode = this.getTreeNode(event.data.id);
      this.model = event.data.id;
    } else if (this.data['type'] === 'date') {
      this.model = this.setDate(event);
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
    node.expanded = true;

    if (node.children.length > 0) {
      return;
    }

    this.attrService.treeNodes(this.data['propertyID'], node.data.value_id, true).subscribe((items) => {
      node.children = parseTree(items as any);
      this.options = _.cloneDeep(this.options);
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
      if (this.data['type'] == 'date' && this.model) {
        this.model = this.model;
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
    if (this.data['fieldName'] === 'case_manager_id') {
      this.caseService.caseManagers$.subscribe((data) => {
        this.setVariables(Array.from(data.values()));
      })
    } else if (this.data['fieldName'] === 'client_id') {
      this.caseService.clients$.subscribe((data) => {
        this.setVariables(Array.from(data.values()));
      })
    } else {
      this.attrService.dropdownOptions$.pipe(
        switchMap(() => this.attrService.getPropertyMap()),
        takeUntil(this.onDestroy$),
        map(properties => properties.get(this.data['propertyID'])?.source.options),
      ).subscribe(options => {
        this.setVariables(options);
      });
    }
  }

  // treeMapChange listens to data for init
  private initTreeOptions(): void {
    this.attrService.treeMap$.subscribe((data) => {
      this.options = data.get(this.data['propertyID']);
      this.hasFilter = true;
      this.selectedNode = this.getTreeNode(this.model);
      this.initialized = true;
    });
  }

  // get tree node for setting selectedTreeNode
  private getTreeNode(nodeID: any): TreeNode | undefined {
    if (nodeID == null || this.options === undefined) return;

    return this.attrService.flatTreeMap.get(nodeID) as TreeNode;
  }

  // saving new treenodes for getTreeNode() 
  private saveFlatTreeNodes(items: any): void {
    for (let tree of flattenTree(_.cloneDeep(items))) {
      if (!this.attrService.flatTreeMap.has(tree.data.id)) {
        this.attrService.flatTreeMap.set(tree.data.id, tree);
      }
    }
  }

  private setDate(value: Date): string | null {
    return value ? formatDate(value) : null;
  }

  private setVariables(options: MOption[]) {
    this.options = options;
    this.hasFilter = options?.length > 5;
    this.initialized = true;
  }

  public isInputDisabled(data: ICustomInput): boolean {
    return this.isDisabled || data['isDisabled'] || this.clientService.isInputDisabled || this.caseService.isInputDisabled;
  }
}
