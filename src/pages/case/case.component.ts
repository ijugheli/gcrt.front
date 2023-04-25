import { Component, OnInit } from '@angular/core';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { APIResponse } from 'src/app/app.interfaces';
import { ICase, MOnSectionEvent } from './case.model';
import { CaseService } from 'src/services/case.service';
import * as caseConfig from './case.config';


@Component({
  selector: 'app-case-page',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css'],
  providers: [MessageService]
})

export class CaseComponent implements OnInit {
  public pageTitle: string = 'ქეისი';
  public isLoading: boolean = false;
  public selectedRow!: ICase;
  public data: ICase[] = [];
  public loadingArray: number[] = Array(10);

  public isModalVisible: boolean = false;
  public detailData!: any;
  public detailCols: any;
  public CaseConfig = caseConfig;
  public caseID: number | null = null;
  template: any;

  constructor(
    public attrService: AttributesService,
    private messageService: MessageService,
    private router: Router,
    public caseService: CaseService,
    public confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.init();
    console.log(this.caseService.clients);
  }

  private init(): void {
    this.isLoading = true;
    this.caseService.index().subscribe({
      next: (data) => this.setData(data),
      error: (e) => { },
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

  private setData(data: APIResponse<ICase[]>): void {
    if (data.data !== undefined) {
      this.caseService.mapCases(data.data);
      this.data = Array.from(this.caseService.cases.values());
    }
  }

  public onDetailClick(type: number, data: any, caseID: number): void {
    const types: Record<number, string> = this.CaseConfig.detailTypes;
    this.caseID = caseID;
    this.caseService.selectedSection = type;

    switch (types[type]) {
      case 'diagnoses':
        this.detailCols = this.caseService.diagnosisCols;
        this.detailData = data;
        break;
      case 'referrals':
        this.detailCols = this.caseService.referralCols;
        this.detailData = data;
        break;
      case 'consultations':
        this.detailCols = this.caseService.consultationCols;
        this.detailData = data;
        break;
      // default:
      //   this.sidebarCols = [];
      //   break;
    }

    this.isModalVisible = true;
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
  }

  public onDetailDelete(event: MOnSectionEvent, type: number) {
    this.confirmationService.confirm({
      header: 'ჩანაწერის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერის წაშლა?',
      accept: () => {
        this.deleteSection(event.data.id, type);

        this.showMsg(event.successMessage!, 'success');
      }
    });
  }

  private deleteSection(id: number, type: number): void {
    const method =
      this.CaseConfig.detailTypes[type] == "diagnoses"
        ? 'destroyDiagnosis'
        : this.CaseConfig.detailTypes[type] == "referrals"
          ? 'destroyReferral'
          : 'destroyConsultation';

    this.caseService[method](id).subscribe((data) => {
      this.caseService.cases.get(data.data[0].case_id)![this.CaseConfig.detailTypes[type]] = data.data;
      this.data = Array.from(this.caseService.cases.values());
      this.detailData = this.caseService.cases.get(data.data[0].case_id)![this.CaseConfig.detailTypes[type]];
    });
  }

  private showMsg(msg: string, type: string): void {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }
}
