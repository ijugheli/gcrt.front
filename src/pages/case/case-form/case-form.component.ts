import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse, IFormMenuOption } from 'src/app/app.interfaces';
import { CaseAttrs, ICase, IConsultation, IDiagnosis, IReferral } from '../case.model';
import { carePlanTreeID } from '../case-attrs/care-plan';
import { CaseService } from 'src/services/case.service';
import { formsOfViolenceTreeID } from '../case-attrs/forms-of-violence';
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
  public menuOptions: IFormMenuOption[] = CaseConfig.menuOptions;
  public consultation: IConsultation = new IConsultation();
  public selectedSection: IFormMenuOption = this.menuOptions[0];
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

  private initTree(treeKey: keyof CaseService, attrID: number): void {
    if (this.caseService[treeKey].length > 0) return;
    this.caseService[treeKey] = this.attrService.treeMap.get(attrID);
  }

  public onUpdate(event: any,) {
    // console.log(this.diagnosis);
  }

  public onEditComplete(): void {
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


  public onSave(event: any): void {
    this.messageService.add({
      severity: 'success',
      summary: 'შენახვა წარმატებით დასრულდა',
    });
  }

  public showSuccess(msg: string): void {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
  }

  private showError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: error,
    });
  }
}
