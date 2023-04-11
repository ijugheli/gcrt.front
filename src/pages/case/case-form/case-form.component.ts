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
  public consultation: IConsultation = new IConsultation();
  public selectedSection: any = { label: 'ქეისი', value: 0, icon: 'pi pi-briefcase' };
  public options: any = [
    { label: 'ქეისი', value: 0, icon: 'pi pi-briefcase' },
    { label: 'ძალადობის ფორმები', value: 1, icon: 'pi pi-list' },
    { label: 'მოვლის გეგმა', value: 2, icon: 'pi pi-list' },
    { label: 'დიაგნოზი', value: 3, icon: 'pi pi-copy' },
    { label: 'რეფერალი', value: 4, icon: 'pi pi-building' },
    { label: 'კონსულტაცია', value: 5, icon: 'pi pi-book' },
    { label: 'ფსიქოდიაგნოსტირება', value: 6, icon: 'pi pi-book' },
  ];
  attribute: any;
  title: any;
  loading: boolean = false;
  referralSources: any;
  incidentSources: any;
  careplans!: any[];
  parents!: any[];

  public menuItems: MenuItem[] = [
    {
      label: 'HTML',
      items: [
        {
          label: 'HTML 1'
        },
        {
          label: 'HTML 2'
        }
      ]
    }];

  public filters: { [key: string]: number | string | null } = {
    'title': ''
  };

  constructor(
    private messageService: MessageService,
    private attrService: AttributesService,
    public caseService: CaseService,
  ) { }

  ngOnInit() {
    this.initTree('carePlanTree', carePlanTreeID);
    this.initTree('formsOfViolenceTree', formsOfViolenceTreeID);
  }

  private initTree(treeKey: keyof CaseService, attrID: number) {
    if (this.caseService[treeKey].length !== 0) return;
    this.attrService
      .full(attrID)
      .subscribe((d) => this.caseService[treeKey] = this.caseService.parseTreeData(d));
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
