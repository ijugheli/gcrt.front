import { Component, OnDestroy, OnInit } from '@angular/core';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { APIResponse } from 'src/app/app.interfaces';
import { ICase, MCase, MOnSectionEvent, ParsedCases } from './case.model';
import { CaseService } from 'src/services/case.service';
import * as caseConfig from './case.config';
import { carePlanTreeID } from './case-attrs/care-plan';
import { formsOfViolenceTreeID } from './case-attrs/forms-of-violence';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { generateRandomNumber } from 'src/app/app.func';
import { MenuService } from 'src/services/app/menu.service';
import { diagnosisCols } from './case-attrs/diagnosis';
import { consultationCols } from './case-attrs/consultation';
import { referralCols } from './case-attrs/referral';
import * as _ from 'lodash';
import { mentalSymptomCols } from './case-attrs/mental-symptom';
import { otherSymptomCols } from './case-attrs/other-symptom';

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
  public isModalVisible: boolean = false;
  // for case section detail table (diagnoses, consultations, referrals, symptoms)
  public isSectionModalVisible: boolean = false;
  public isSectionSymptom: boolean = false;
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
    public caseService: CaseService,
    public confirmationService: ConfirmationService,
    public menuService: MenuService,
    private router: Router,
  ) { }


  ngOnInit() {
    this.init();
    this.initTree('carePlanTree', carePlanTreeID);
    this.initTree('formsOfViolenceTree', formsOfViolenceTreeID);
  }

  private init(): void {
    this.caseService.isValidationEnabled = false;
    this.isLoading = true;

    forkJoin({
      response: this.caseService.index(),
      clients: this.caseService.clients$,
      caseManagers: this.caseService.caseManagers$
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

  public onDetailClick(caseID: number): void {
    this.caseID = caseID;
    this.caseService.selectedSection = this.CaseConfig.detailTypeIDS['diagnoses'];
    this.parsedDetailData = this.caseService.parsedCases.get(this.caseID!)!['diagnoses'];
    this.detailCols = diagnosisCols;
    this.detailData = this.caseService.cases.get(this.caseID!)!['diagnoses'];
    this.isModalVisible = true;
    this.isSectionModalVisible = true;
  }

  public onDetailDropdownChange(event: any): void {
    const types: Record<number, string> = this.CaseConfig.detailTypes;
    this.caseService.selectedSection = event.value;
    this.parsedDetailData = this.caseService.parsedCases.get(this.caseID!)![types[event.value]]; // for Table
    this.detailData = this.caseService.cases.get(this.caseID!)![types[event.value]]; // for Form

    // Tables use columns for showing fields dynamically
    switch (types[event.value]) {
      case 'diagnoses':
        this.detailCols = diagnosisCols;
        break;
      case 'referrals':
        this.detailCols = referralCols;
        break;
      case 'consultations':
        this.detailCols = consultationCols;
        break;
      case 'mental_symptoms':
        this.detailCols = mentalSymptomCols;
        break;
      case 'somatic_symptoms':
        this.detailCols = mentalSymptomCols;
        break;
      case 'other_symptoms':
        this.detailCols = otherSymptomCols;
        break;
      case 'forms_of_violences':
        this.tree = this.caseService.formsOfViolenceTree;
        break;
      case 'care_plans':
        this.tree = this.caseService.carePlanTree;
        break;
    }

    if (this.isTreeSection()) {
      this.isTreeModalVisible = true;
      this.isSectionModalVisible = false;
    } else {
      this.isTreeModalVisible = false;
      this.isSectionModalVisible = true;
    }
  }

  public onDetailAdd() {
    this.caseService.selectedSectionModel = null;
    this.router.navigate([`/case/edit/${this.caseID}`]);
  }

  public onDetailEdit(event: any) {
    this.caseService.selectedSectionModel = event;
    this.router.navigate([`/case/edit/${this.caseID}`]);
  }

  public onModalHide(event: any) {
    this.caseService.selectedSection = null;
    this.isTreeModalVisible = false;
    this.isSectionModalVisible = false;
    this.isModalVisible = false;
  }

  public onDetailDelete(event: MOnSectionEvent) {
    this.confirmationService.confirm({
      header: 'ჩანაწერის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერის წაშლა?',
      accept: () => {
        // onDelete sends {record_date: '', records: []} if somatic or mental symptoms section
        const isSymptomSection: boolean = this.isSymptomSection();
        this.deleteSection(isSymptomSection ? event.data.records.map((e: any) => e.id) : event.data.id, this.caseService.selectedSection!);
        this.showMsg(event.successMessage!, 'success');
      }
    });
  }

  public isSymptomSection() {
    return this.caseService.isSymptomSection(this.CaseConfig.detailTypes[this.caseService.selectedSection!]);
  }

  public isTreeSection() {
    return this.caseService.isTreeSection(this.CaseConfig.detailTypes[this.caseService.selectedSection!]);
  }

  public onTreeSave(event: any[]) {
    const sectionType = this.CaseConfig.detailTypes[this.caseService.selectedSection!];
    const method = sectionType == "forms_of_violences"
      ? 'updateFormsOfViolences'
      : 'updateCarePlans';

    this.caseService[method](event, this.caseID!).subscribe((data) => {
      this.updateSections(data, this.caseService.selectedSection!);
      this.showMsg(data.message, 'success')
    }, (e) => this.showMsg(e.e.message, 'error'));
  }

  private setData(data: APIResponse<ParsedCases>): void {
    if (data.data !== undefined) {
      this.data = data.data.cases;
      this.tableData = data.data.parsedCases;
    }
  }

  private initTree(treeKey: keyof CaseService, attrID: number): void {
    if (this.caseService[treeKey].length > 0) return;
    this.attrService.treeMap$.subscribe((treeMap) => {
      this.caseService[treeKey] = treeMap.get(attrID);
    })
  }

  private deleteSection(id: number & number[], type: number): void {
    const sectionType: string = this.CaseConfig.detailTypes[type];
    // isSymptomSection for somatic and mental symptoms
    const isSymptomSection: boolean = this.caseService.isSymptomSection(sectionType);
    const method = isSymptomSection ? this.caseService.getSymptomDestroyMethod(sectionType) : this.caseService.getSectionDestroyMethod(sectionType);

    this.caseService[method](id, this.caseID!).subscribe((data) => {
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
    // isSymptomSection for somatic and mental symptoms, we only need to parse data for MCase
    const isSymptomSection: boolean = this.caseService.isSymptomSection(sectionType);
    let newParsedArray: any[] = [];

    if (this.CaseConfig.sections.includes(sectionType)) {
      ICase[sectionType] = response.data.map((value: any) => {
        return isSymptomSection ? value : this.parseNewDetails(value, newParsedArray);
      });
    } else if (sectionType == 'forms_of_violences' || 'care_plans') {
      ICase[sectionType] = response.data;
      newParsedArray = response.data;
    }

    MCase[sectionType] = isSymptomSection ? this.caseService.parseSymptoms(ICase[sectionType]) : newParsedArray;
    this.data = Array.from(this.caseService.cases.values());
    this.detailData = ICase[sectionType];
    this.parsedDetailData = MCase[sectionType];
  }


  private parseNewDetails(value: any, newParsedArray: any[]) {
    const item = _.cloneDeep(value);
    item.generated_id = Date.now() + generateRandomNumber();
    const copy = _.cloneDeep(item);
    newParsedArray.push(this.caseService.parseSection(copy));
    return item;
  }
}
