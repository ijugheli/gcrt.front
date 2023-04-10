import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
import { ATTR_TYPES } from 'src/app/app.config';
import { CaseAttrs, ICase, ICaseSection, IConsultation, IDiagnosis, IReferral, MCaseSection } from '../case.model';
import { flattenTree } from 'src/app/app.func';


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
  careplans!: any[];
  parents!: any[];

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

    this.Case.care_plans[0] = {
      case_id: 0,
      category: 125657,
      comment: 'ragaca'
    };
    //რეფერალური წყარო 
    this.attrService
      .full(45, true)
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
      this.careplans = this.parseCaseSection(flattenTree(this.referralSources));
      this.parents = this.getCarePlanP();
      console.log(this.careplans);
      // console.log(rame);
      return;
    }
  }

  public getCarePlanP() {
    return this.careplans.filter(e => e.p_value_id == 0);
  }

  public getCarePlanNodes(id: number) {
    return this.careplans.filter(e => e.p_value_id == id);
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

  private parseCaseSection(tree: any[]): any[] {
    return tree.map((node: any) => {
      const temp = new MCaseSection();
      temp.category = node.data.id;
      temp.p_value_id = node.data.p_value_id;
      temp.value_id = node.data.value_id;
      temp.title = node.data.title;
      temp.p_title = this.referralSources.find((e: any) => e.data.value_id == temp.p_value_id)?.data.title ?? '';

      const carePlan = this.Case.care_plans.find(e => e.category == temp.category);
      if (carePlan !== undefined) {
        temp.isSelected = true;
        temp.comment = carePlan.comment;
      }
      return temp;
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
