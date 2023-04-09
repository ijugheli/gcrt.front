import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
import { ATTR_TYPES } from 'src/app/app.config';
import { CaseAttrs, ICase, ICaseSection, IConsultation, IDiagnosis, IReferral } from '../case.model';


@Component({
  selector: 'app-case-form',
  templateUrl: './case-form.component.html',
  styleUrls: ['./case-form.component.css', '../../client/client-form/client-form.component.scss'],
  providers: [MessageService]
})

export class CaseFormComponent implements OnInit {
  public pageTitle: string = 'კლიენტის დამატება';
  public isLoading: boolean = false;
  public CaseAttrs: CaseAttrs = new CaseAttrs();
  public Case: ICase = new ICase();
  public referral: IReferral = new IReferral();
  public diagnosis: IDiagnosis = new IDiagnosis();
  public consultation: IConsultation = new IConsultation();
  public carePlan: ICaseSection = new ICaseSection();
  public formsOfViolence: ICaseSection = new ICaseSection();
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

  public onOptionClick(event: any) {
  }
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
  ) { }

  ngOnInit() {
    //რეფერალური წყარო 
    this.referralSources = this.attrService
      .full(30, true)
      .subscribe((d) => this.receiveResponse(d));
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
      this.referralSources = this.attrService.parseTree(data['tree']);;
      return;
    }
  }

  public onNodeExpand(event: any) {
    const node = event.node;
    if (node.children.length > 0) {
      return;
    }

    this.attrService.treeNodes(43, node.data.value_id, true).subscribe((items) => {
      node.children = this.attrService.parseTree(items);
      this.referralSources = [...this.referralSources];
      node.expanded = true;
    });
  }


  private showSuccess(msg: string) {
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
