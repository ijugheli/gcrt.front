import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ICaseCol } from 'src/pages/client/client.model';
import { IDiagnosis } from '../../case.model';
import { CheckboxModule } from 'primeng/checkbox';
// For diagnosis, consultation, referral,
@Component({
  standalone: true,
  selector: 'app-case-section-table',
  templateUrl: './case-section-table.component.html',
  styleUrls: ['./case-section-table.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, SkeletonModule, CheckboxModule]
})

export class CaseSectionTable implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ICaseCol[] = [];
  @Output() onEdit = new EventEmitter<any>();
  public loading: boolean = true;
  public selectedRow: any = [];
  public checked: boolean = false;

  constructor(
    private attrService: AttributesService,
  ) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.loading = false;
  }

  public onEditClick() {
    this.onEdit.emit(Object.assign({}, this.selectedRow));
  }

  public getFieldValue(field: any) {
    if (typeof field == 'string' || field instanceof String) {
      return field;
    }

    return this.attrService.dropdownOptions.get(field)?.name;
  }
}
