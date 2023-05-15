import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse, IFormMenuOption } from 'src/app/app.interfaces';
import { CaseAttrs, ICase, MCase, MOnSectionEvent } from '../case.model';
import { carePlanTreeID } from '../case-attrs/care-plan';
import { CaseService } from 'src/services/case.service';
import { formsOfViolenceTreeID } from '../case-attrs/forms-of-violence';
import * as caseConfig from '../case.config';
import { Router } from '@angular/router';
import { generateRandomNumber, getRouteParam } from 'src/app/app.func';

@Component({
  selector: 'app-case-form',
  templateUrl: './case-form.component.html',
  styleUrls: ['./case-form.component.css', '../../client/client-form/client-form.component.scss'],
  providers: [MessageService]
})

export class CaseFormComponent implements OnInit {
  public pageTitle: string = 'ქეისის';
  public isLoading: boolean = false;
  public CaseAttrs: CaseAttrs = new CaseAttrs();
  public Case: ICase = new ICase();
  public parsedCase!: MCase;
  public caseID!: number | null;
  public CaseConfig = caseConfig;
  public menuOptions: IFormMenuOption[] = caseConfig.menuOptions;
  public selectedSection: IFormMenuOption = this.menuOptions[0];
  public selectedSectionModel: any = null; // for initializing section model when user clicks edit/add in Case section detail table
  public hasCaseID: boolean = false;
  public id: string | null | undefined = getRouteParam('id');



  constructor(
    private messageService: MessageService,
    private attrService: AttributesService,
    private confirmationService: ConfirmationService,
    public caseService: CaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.init();
    this.initTree('carePlanTree', carePlanTreeID);
    this.initTree('formsOfViolenceTree', formsOfViolenceTreeID);
  }

  public onSectionSave(event: MOnSectionEvent, type: any): void {
    this.updateSections(event, type);

    if (event.errorMessage !== undefined) {
      this.showMsg(event.errorMessage, 'error');
      return;
    }

    if (!this.hasCaseID) {
      this.messageService.add({
        severity: 'warn',
        summary: 'სექციის დასამატებლად შეავსეთ ქეისის სავალდებულო ველები',
      });
      return;
    }

    this.updateSectionRequests(event, type);
  }

  public onSectionItemDelete(event: MOnSectionEvent, type: number) {
    this.confirmationService.confirm({
      header: 'ჩანაწერის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერის წაშლა?',
      accept: () => {
        if (event.data?.id !== null && event.data?.id !== undefined) {
          this.deleteSection(event.data.id, type);
        } else {
          let model: any[] = this.Case[this.CaseConfig.detailTypes[type]];
          const index = model.findIndex((e: any) => e.generated_id == event.data.generated_id);
          model.splice(index, 1);
        }
        this.showMsg(event.successMessage!, 'success');
      }
    });
  }

  public onSave(event: any, isFormSubmit: boolean = false): void {
    if (!this.caseService.validate()) {
      this.showMsg('სექციის დასამატებლად შეავსეთ ქეისის სავალდებულო ველები', 'warn');
      this.showMsg('შეავსეთ ქეისის სავალდებულო ველები', 'error');
      return;
    }

    if (!this.hasCaseID && !isFormSubmit) {
      this.showMsg('სექციის დასამატებლად შეავსეთ დაამატეთ ქეისი', 'warn')
      return;
    }

    this.caseService.isValidationEnabled = false;
    this.caseService.isInputDisabled = true;

    this.caseService.storeCase(this.Case).subscribe({
      next: (data) => {
        this.Case = new ICase(data.data!);
        this.caseID = this.Case.case.id;
        this.parsedCase = this.caseService.parseCase(this.Case);
        this.showMsg(data.message, 'success');
        if (!this.hasCaseID) {
          window.history.replaceState({}, '', `/case/edit/${this.caseID}`);
          this.hasCaseID = true;
        }
      },
      error: (e) => {
        this.caseService.isInputDisabled = false;
        this.showMsg(e.error.message, 'error');
      },
      complete: () => {
        this.caseService.isInputDisabled = false;
        this.initPageTitle();
      }
    });
  }

  private init(): void {
    this.caseService.values.clear();
    this.initCase();
  }

  private initCase(): void {
    // for initializing selected section and its model when user clicks edit/add from main case table
    if (this.caseService.selectedSection !== null) {
      this.selectedSection = this.menuOptions[this.caseService.selectedSection];
      this.selectedSectionModel = this.caseService.selectedSectionModel;
      this.caseService.selectedSection = this.caseService.selectedSectionModel = null;
    }

    if (this.id === undefined || this.id === null) {
      this.pageTitle = 'ქეისის დამატება';
      this.parsedCase = new MCase(this.Case);
      return;
    };

    this.caseID = parseInt(this.id!);
    this.isLoading = true;

    if (this.caseService.cases.has(this.caseID)) {
      this.Case = this.caseService.cases.get(this.caseID)!;
      this.parsedCase = this.caseService.parsedCases.get(this.caseID)!;
      this.isLoading = false;
      this.initPageTitle();
    } else {
      this.caseService.show(this.caseID).subscribe({
        next: (data) => {
          this.Case = new ICase(data.data);
          this.parsedCase = this.caseService.parseCase(Object.assign(this.Case));
        },
        error: (e) => {
          this.showMsg(e.error.message, 'error');
          setTimeout(() => {
            this.router.navigate([`/case`]);
          }, 2000);
        },
        complete: () => {
          this.isLoading = false;
          this.initPageTitle();
        }
      });
    }

    this.hasCaseID = this.caseID != null;
  }

  private showMsg(msg: string, type: string): void {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  private updateSectionRequests(event: MOnSectionEvent, type: number) {
    this.caseService.isInputDisabled = true;
    const method =
      this.CaseConfig.detailTypes[type] == "diagnoses"
        ? 'updateDiagnosis'
        : this.CaseConfig.detailTypes[type] == "referrals"
          ? 'updateReferral'
          : 'updateConsultation';

    this.caseService[method](event.model).subscribe({
      next: (data) => {
        this.updateSections(data, type);
        this.showMsg(data.message, 'success');
      },
      error: (e) => {
        this.showMsg(e.e.message, 'error');
        this.isLoading = false;
        this.caseService.isInputDisabled = false;
      },
      complete: () => {
        this.caseService.isInputDisabled = false;
        this.isLoading = false;
      }
    });
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

  private updateSections(event: MOnSectionEvent | APIResponse, type: number): void {
    if (event.data === undefined) return;
    const sectionType = this.CaseConfig.detailTypes[type];
    const newParsedArray: any[] = [];

    this.Case[sectionType] = event.data.map((value: any) => {
      return this.parseNewDetails(value, newParsedArray);
    })

    this.parsedCase[sectionType] = newParsedArray;
  }

  private parseNewDetails(value: any, newParsedArray: any[]): Object {
    const item = Object.assign({}, value);
    item.generated_id = Date.now() + generateRandomNumber();
    const copy = Object.assign({}, item);
    newParsedArray.push(this.caseService.parseSection(copy));
    return item;
  }

  private initTree(treeKey: keyof CaseService, attrID: number): void {
    if (this.caseService[treeKey].length > 0) return;
    this.attrService.treeMap$.subscribe((treeMap) => {
      this.caseService[treeKey] = treeMap.get(attrID);
    })
  }

  private initPageTitle() {
    this.caseService.clients$.subscribe((_) => {
      this.pageTitle = `ქეისის რედაქტირება - #${this.caseID} - ${this.caseService.clients.get(this.Case.case.client_id!)?.name}`;
    });
  }
}
