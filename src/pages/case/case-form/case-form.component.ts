import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
import { ATTR_TYPES } from 'src/app/app.config';
import { CaseAttrs, ICase, IConsultation, IDiagnosis, IReferral } from '../case.model';
import { flattenTree, parseTree } from 'src/app/app.func';
import { carePlanMap, carePlanTreeID } from '../case-attrs/care-plan';
import { CaseService } from 'src/services/case.service';
import { formsOfViolenceMap, formsOfViolenceTreeID } from '../case-attrs/forms-of-violence';
import { diagnosisCols } from '../case-attrs/diagnosis';
import { referralCols } from '../case-attrs/referral';
import { consultationCols } from '../case-attrs/consultation';
import * as CaseConfig from '../case.config';


@Component({
  selector: 'app-case-form',
  templateUrl: './case-form.component.html',
  styleUrls: ['./case-form.component.css', '../../client/client-form/client-form.component.scss'],
  providers: [MessageService]
})

export class CaseFormComponent implements OnInit {
  public pageTitle: string = 'ქეისი';
  public isLoading: boolean = false;
  public CaseAttrs: CaseAttrs = new CaseAttrs();
  public Case: ICase = new ICase();
  public referral: IReferral = new IReferral();
  public diagnosis: IDiagnosis = new IDiagnosis();
  public copy: IDiagnosis = new IDiagnosis();
  public menuOptions: any[] = CaseConfig.menuOptions;
  public consultation: IConsultation = new IConsultation();
  public selectedSection: any = this.menuOptions[0];
  title: any;
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private attrService: AttributesService,
    public caseService: CaseService,
  ) { }

  ngOnInit() {
    this.initTree('carePlanTree', carePlanTreeID);
    this.initTree('formsOfViolenceTree', formsOfViolenceTreeID);
    var rame: IDiagnosis = {
      id: null,
      case_id: null,
      generated_id: Date.now(),
      comment: "dsadsda",
      diagnosis_dsmiv: 126100,
      icd: 100884,
      status: 253,
      type: 256,
      diagnosis_icd10: null,
      diagnosis_date: null,
      links_with_trauma: null,
    }
    this.Case.diagnosis.push(rame);

  }

  private initTree(treeKey: keyof CaseService, attrID: number) {
    if (this.caseService[treeKey].length > 0) return;
    this.caseService[treeKey] = this.attrService.treeMap.get(attrID);
  }

  public onUpdate(event: any,) {
    // console.log(this.diagnosis);
  }

  public onEditComplete() {
    const id = this.diagnosis.id ?? this.diagnosis.generated_id;
    const index = this.Case.diagnosis.findIndex(e => e.generated_id == id || e.id == id);
    if (index !== -1) {
      this.Case.diagnosis[index] = Object.assign({}, this.diagnosis);
      this.messageService.add({
        severity: 'success',
        summary: 'რედაქტირება წარმატებით დასრულდა',
      });
      this.diagnosis = Object.assign({}, new IDiagnosis());

      return
    } else {
      this.Case.diagnosis.push(this.diagnosis);
    }

    this.diagnosis = Object.assign({}, new IDiagnosis());
    console.log(this.diagnosis);
    this.messageService.add({
      severity: 'success',
      summary: 'წარმატებით დაემატა',
    });
  }


  public onSave(event: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'შენახვა წარმატებით დასრულდა',
    });
  }

  public showSuccess(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
  }

  private showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: error,
    });
  }
}
