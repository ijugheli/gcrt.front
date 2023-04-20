import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { APIResponse } from 'src/app/app.interfaces';
import { Case, ICase } from './case.model';
import { CaseService } from 'src/services/case.service';
import * as CaseConfig from './case.config';


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

  public isSidebarVisible: boolean = false;
  public sidebarData!: any;
  public sidebarCols: any;

  constructor(
    public attrService: AttributesService,
    private messageService: MessageService,
    private router: Router,
    public caseService: CaseService,
    public confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.init();
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
            this.showSuccess(data.message);
          },
          error: (e: any) => this.showError(e.error.message),
          complete: () => { }
        });
      }, reject: () => {

      }
    });

  }


  private setData(data: APIResponse<ICase[]>): void {
    if (data.data !== undefined) {
      this.caseService.mapCases(data.data);
      this.data = Array.from(this.caseService.cases.values());
    }
  }

  public onDetailClick(type: number, data: any): void {
    this.sidebarData = data;
    const types: Record<number, string> = CaseConfig.detailTypes;

    switch (types[type]) {
      case 'main':
        this.sidebarCols = [];
        break;
      case 'additional':
        this.sidebarCols = [];
        break;
      case 'contact':
        this.sidebarCols = [];
        break;
      default:
        this.sidebarCols = [];
        break;
    }
    this.isSidebarVisible = true;
  }

  private showSuccess(msg: string): void {
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
