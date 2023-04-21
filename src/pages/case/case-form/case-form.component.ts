import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse, IFormMenuOption } from 'src/app/app.interfaces';
import { CaseAttrs, ICase, MOnSectionEvent } from '../case.model';
import { carePlanTreeID } from '../case-attrs/care-plan';
import { CaseService } from 'src/services/case.service';
import { formsOfViolenceTreeID } from '../case-attrs/forms-of-violence';
import { caseSectionForms, menuOptions } from '../case.config';
import { ActivatedRoute, Router } from '@angular/router';

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
  public caseID!: number | null;
  public menuOptions: IFormMenuOption[] = menuOptions;
  public selectedSection: IFormMenuOption = this.menuOptions[0];
  public hasCaseID: boolean = false;

  constructor(
    private messageService: MessageService,
    private attrService: AttributesService,
    private confirmationService: ConfirmationService,
    public caseService: CaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initTree('carePlanTree', carePlanTreeID);
    this.initTree('formsOfViolenceTree', formsOfViolenceTreeID);
    this.init();
  }

  private initTree(treeKey: keyof CaseService, attrID: number): void {
    if (this.caseService[treeKey].length > 0) return;
    this.attrService.treeMapChange.subscribe((treeMap) => {
      this.caseService[treeKey] = treeMap.get(attrID);
    })
  }

  public onSectionSave(event: MOnSectionEvent, type: any): void {
    this.updateSections(event, type);

    if (event.errorMessage !== undefined) {
      this.showError(event.errorMessage);
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
          const index = this.Case[caseSectionForms[type]].findIndex((e: any) => e.generated_id == event.data.generated_id);
          this.Case[caseSectionForms[type]].splice(index, 1);
          this.Case[caseSectionForms[type]] = [...this.Case[caseSectionForms[type]]];
        }
        this.showSuccess(event.successMessage!);
      }, reject: () => {
      }
    });
  }

  public onSave(event: any, isFormSubmit: boolean = false): void {
    if (!this.caseService.validate()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'სექციის დასამატებლად შეავსეთ ქეისის სავალდებულო ველები',
      });
      this.messageService.add({
        severity: 'error',
        summary: 'შეავსეთ ქეისის სავალდებულო ველები',
      });
      return;
    }

    if (!this.hasCaseID && !isFormSubmit) {
      this.messageService.add({
        severity: 'warn',
        summary: 'სექციის დასამატებლად შეავსეთ დაამატეთ ქეისი',
      });
      return;
    }

    this.caseService.isValidationEnabled = false;
    this.caseService.isInputDisabled = true;

    this.caseService.storeCase(this.Case).subscribe({
      next: (data) => {
        this.Case = data.data!;
        this.Case.forms_of_violences = this.Case.forms_of_violences;
        this.Case.care_plans = this.Case.care_plans;
        this.showSuccess(data.message)
      },
      error: (e) => {
        this.caseService.isInputDisabled = false;
        this.showError(e.error.message);
      },
      complete: () => {
        this.caseService.isInputDisabled = false;
      }
    });
  }

  private init(): void {
    this.caseService.values.clear();
    this.initCase();
  }

  private initCase(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === undefined && id === null) return;

    this.caseID = parseInt(id!);
    this.isLoading = true;

    if (this.caseService.cases.has(this.caseID)) {
      this.Case = this.caseService.cases.get(this.caseID)!;
      this.isLoading = false;
    } else {
      this.caseService.show(this.caseID).subscribe({
        next: (data) => {
          this.Case = data.data!
        },
        error: (e) => {
          this.showError(e.error.message);
          setTimeout(() => {
            this.router.navigate([`/case`]);
          }, 2000);
        },
        complete: () => {
          this.isLoading = false;
        }
      });

      this.pageTitle = 'ქეისის რედაქტირება';
      this.hasCaseID = this.caseID !== null;
    }
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

  private updateSections(event: MOnSectionEvent | APIResponse, type: number): void {
    if (event.data === undefined) return;
    this.Case[caseSectionForms[type]] = event.data;
  }

  private updateSectionRequests(event: MOnSectionEvent, type: number) {
    const method =
      caseSectionForms[type] == "diagnoses"
        ? 'updateDiagnosis'
        : caseSectionForms[type] == "referrals"
          ? 'updateReferral'
          : 'updateConsultation';

    this.caseService[method](event.model).subscribe({
      next: (data) => {
        this.updateSections(data, type);
        this.showSuccess(data.message);
      },
      error: (e) => {
        this.showError(e.e.message);
        this.isLoading = false
      },
      complete: () => this.isLoading = false
    });

  }

  private deleteSection(id: number, type: number): void {
    const method =
      caseSectionForms[type] == "diagnoses"
        ? 'destroyDiagnosis'
        : caseSectionForms[type] == "referrals"
          ? 'destroyReferral'
          : 'destroyConsultation';

    this.caseService[method](id).subscribe((data) => {
      this.Case[caseSectionForms[type]] = data.data;
    }
    );
  }
}
