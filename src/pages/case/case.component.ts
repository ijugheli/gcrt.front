import { Component, OnInit } from '@angular/core';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { APIResponse } from 'src/app/app.interfaces';
import { ICase, IConsultation, IDiagnosis, IReferral, MCase, MOnSectionEvent } from './case.model';
import { CaseService } from 'src/services/case.service';
import * as caseConfig from './case.config';
import { carePlanTreeID } from './case-attrs/care-plan';
import { formsOfViolenceTreeID } from './case-attrs/forms-of-violence';
import { combineLatestAll, forkJoin } from 'rxjs';
import { generateRandomNumber } from 'src/app/app.func';


@Component({
  selector: 'app-case-page',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css'],
  providers: [MessageService]
})

export class CaseComponent implements OnInit {
  public pageTitle: string = 'ქეისი';
  public isLoading: boolean = false;
  public selectedRow!: MCase;
  public data: ICase[] = [];
  public tableData: MCase[] = [];
  public loadingArray: number[] = Array(10);
  public CaseConfig = caseConfig;

  // for case section detail table (diagnoses, consultations, referrals)
  public isModalVisible: boolean = false;
  public detailData!: any;
  public parsedDetailData!: any;
  public detailCols: any;
  public caseID: number | null = null;

  // for tree checkbox table (formsOfViolences, carePlans)
  public isTreeModalVisible: boolean = false;
  public tree: any = [];

  constructor(
    public attrService: AttributesService,
    private messageService: MessageService,
    private router: Router,
    public caseService: CaseService,
    public confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.init();
    this.initTree('carePlanTree', carePlanTreeID);
    this.initTree('formsOfViolenceTree', formsOfViolenceTreeID);
  }

  private init(): void {
    this.isLoading = true;

    forkJoin({
      response: this.caseService.index(),
      clients: this.caseService.clientChanges,
      caseManagers: this.caseService.caseManagerChanges
    }
    ).subscribe({
      next: ({ response, clients, caseManagers }) => this.setData(response),
      error: (e) => this.showMsg(e.error.message, 'danger'),
      complete: () => this.isLoading = false
    });
  }

  public onEditClick(): void {
    if (this.selectedRow != undefined) {
      this.router.navigate([`/case/edit/${this.selectedRow.case.id}`]);
    }
  }

  public onAddClick(): void {
    this.router.navigate(['/case/add']);
  }


  public onDeleteClick(): void {
    this.confirmationService.confirm({
      header: 'ჩანაწერის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერის წაშლა?',
      accept: () => {
        this.caseService.destroy(this.selectedRow.case.id!).subscribe({
          next: (data) => {
            this.setData(data);
            this.showMsg(data.message, 'success');
          },
          error: (e: any) => this.showMsg(e.error.message, 'error'),
        });
      }
    });
  }

  public onDetailClick(type: number, data: any, caseID: number, isTree: boolean = false): void {
    const types: Record<number, string> = this.CaseConfig.detailTypes;
    this.caseID = caseID;
    this.caseService.selectedSection = type;
    this.parsedDetailData = data;
    this.detailData = this.caseService.cases.get(this.caseID)![types[type]];

    switch (types[type]) {
      case 'diagnoses':
        this.detailCols = this.caseService.diagnosisCols;
        break;
      case 'referrals':
        this.detailCols = this.caseService.referralCols;
        break;
      case 'consultations':
        this.detailCols = this.caseService.consultationCols;
        break;
      case 'forms_of_violences':
        this.tree = this.caseService.formsOfViolenceTree;
        break;
      case 'care_plans':
        this.tree = this.caseService.carePlanTree;
        break;
    }

    isTree ? this.isTreeModalVisible = true : this.isModalVisible = true;
  }

  public onDetailAdd() {
    this.caseService.selectedSectionModel = null;
    this.router.navigate([`/case/edit/${this.caseID}`]);
  }

  public onDetailEdit(event: any) {
    this.caseService.selectedSectionModel = event;
    this.router.navigate([`/case/edit/${this.caseID}`]);
  }

  public onModalHide(event: any, isTree: boolean = false) {
    this.caseService.selectedSection = null;
    isTree ? this.isTreeModalVisible = false : this.isModalVisible = false;
  }

  public onDetailDelete(event: MOnSectionEvent) {
    this.confirmationService.confirm({
      header: 'ჩანაწერის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერის წაშლა?',
      accept: () => {
        this.deleteSection(event.data.id, this.caseService.selectedSection!);

        this.showMsg(event.successMessage!, 'success');
      }
    });
  }

  public onTreeSave(event: any[]) {
    const sectionType = this.CaseConfig.detailTypes[this.caseService.selectedSection!];
    const method =
      sectionType == "forms_of_violences"
        ? 'updateFormsOfViolences'
        : 'updateCarePlans'

    this.caseService[method](event, this.caseID!).subscribe((data) => {
      this.updateSections(data, this.caseService.selectedSection!);
      this.showMsg(data.message, 'success')
    }, (e) => this.showMsg(e.e.message, 'error'));
  }

  private setData(data: APIResponse<ICase[]>): void {
    if (data.data !== undefined) {
      this.caseService.mapCases(data.data);
      this.data = Array.from(this.caseService.cases.values());
      this.tableData = Array.from(this.caseService.parsedCases.values());
    }
  }

  private initTree(treeKey: keyof CaseService, attrID: number): void {
    if (this.caseService[treeKey].length > 0) return;
    this.attrService.treeMapChange.subscribe((treeMap) => {
      this.caseService[treeKey] = treeMap.get(attrID);
    })
  }

  private deleteSection(id: number, type: number): void {
    const sectionType = this.CaseConfig.detailTypes[type];
    const method =
      sectionType == "diagnoses"
        ? 'destroyDiagnosis'
        : sectionType == "referrals"
          ? 'destroyReferral'
          : 'destroyConsultation';

    this.caseService[method](id).subscribe((data) => {
      this.updateSections(data, type);
    });
  }

  private showMsg(msg: string, type: string): void {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  private updateSections(response: APIResponse<any>, type: number) {
    const sectionType = this.CaseConfig.detailTypes[type];
    const ICase: ICase = this.caseService.cases.get(this.caseID!)!;
    const MCase: MCase = this.caseService.parsedCases.get(this.caseID!)!;
    let newParsedArray: any[] = [];

    if (sectionType == 'diagnoses' || 'referrals' || 'consultations') {
      ICase[sectionType] = response.data.map((value: any) => {
        return this.parseNewDetails(value, newParsedArray);
      });
    } else if (sectionType == 'forms_of_violences' || 'care_plans') {
      ICase[sectionType] = response.data;
      newParsedArray = response.data;
    }

    MCase[sectionType] = newParsedArray;
    this.data = Array.from(this.caseService.cases.values());
    this.detailData = ICase[sectionType];
    this.parsedDetailData = MCase[sectionType];
  }

  private parseNewDetails(value: any, newParsedArray: any[]) {
    const item = Object.assign({}, value);
    item.generated_id = Date.now() + generateRandomNumber();
    const copy = Object.assign({}, item);
    newParsedArray.push(this.caseService.parseSection(copy));
    return item;
  }
}
