import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
import { ATTR_TYPES } from 'src/app/app.config';
import { CaseAttrs, ICase, IConsultation, IDiagnosis, IReferral, MCheckboxTableItem, CaseSharedInterface } from '../../case.model';
import { flattenTree } from 'src/app/app.func';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';

@Component({
  standalone: true,
  selector: 'app-checkbox-table',
  templateUrl: './checkbox-table.component.html',
  styleUrls: ['./checkbox-table.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, CheckboxModule, BadgeModule]
})

export class CheckboxTable<T extends CaseSharedInterface> implements OnInit {
  @Input() initialTree: any[] = [];
  @Input() caseSectionModel: T[] = [];
  @Output() onSave = new EventEmitter<T[]>();
  public parsedTree: MCheckboxTableItem[] = [];
  public parents: MCheckboxTableItem[] = [];

  constructor(
    private attrService: AttributesService,
  ) { }

  ngOnInit() {
    this.init();
  }


  private init() {
    this.parsedTree = this.parseModel(flattenTree(this.initialTree));
    this.parents = this.filterParents();
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

    // if (isTree) {
    //   this.referralSources = this.attrService.parseTree(data['tree']);;
    //   this.careplans = this.parseCaseSection(flattenTree(this.referralSources));
    //   this.parents = this.getCarePlanP();
    //   console.log(this.careplans);
    //   // console.log(rame);
    //   return;
    // }
  }

  public getNodes(id: number) {
    return this.parsedTree.filter(e => e.p_value_id == id);
  }

  public getSelectedNodeCount(id: number): string {
    return this.parsedTree.filter(e => e.p_value_id == id && e.isSelected).length.toString();
  }

  public onchange(event: any) {
    console.log(this.parsedTree);
  }

  private filterParents() {
    return this.parsedTree.filter(e => e.p_value_id == 0);
  }
  private parseModel(tree: any[]): any[] {
    return tree.map((node: any) => {
      const temp = new MCheckboxTableItem();
      temp.category = node.data.id;
      temp.p_value_id = node.data.p_value_id;
      temp.value_id = node.data.value_id;
      temp.title = node.data.title;
      temp.p_title = this.initialTree.find((e: any) => e.data.value_id == temp.p_value_id)?.data.title ?? '';

      const model = this.caseSectionModel.find(e => e.category == temp.category);

      if (model !== undefined) {
        temp.case_id = model.case_id ?? null;
        temp.isSelected = true;
        temp.comment = model.comment;
      }

      return temp;
    });
  }

  public onComplete() {
    const parsedModel = this.parsedTree.filter(e => e.isSelected && e.p_value_id !== 0).map((e) => {
      let model: any = {};
      model.category = e.category;
      model.case_id = e.case_id;
      model.comment = e.comment;
      return model;
    }) as T[];

    this.onSave.emit(parsedModel);
  }
}
