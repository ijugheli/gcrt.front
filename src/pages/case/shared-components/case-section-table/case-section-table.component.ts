import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckboxModule } from 'primeng/checkbox';
import { ICaseCol } from 'src/app/app.interfaces';
import { MOnSectionEvent } from '../../case.model';
import { MenuService } from 'src/services/app/menu.service';
import { ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';

// For diagnosis, consultation, referral, symptoms
@Component({
  standalone: true,
  selector: 'app-case-section-table',
  templateUrl: './case-section-table.component.html',
  styleUrls: ['./case-section-table.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, SkeletonModule, CheckboxModule]
})

export class CaseSectionTable implements OnInit {
  // IOtherSymptom[] | ISomaticSymptom[] | IMentalSymptom[] | IReferral[] | IConsultation[] | IDiagnosis[]
  @Input() data: any[] = [];
  // MOtherSymptom[] | MSomaticSymptom[] | MMentalSymptom[] | MReferral[] | MConsultation[] | MDiagnosis[]
  @Input() parsedData: any[] = [];
  @Input() columns: ICaseCol[] = [];
  @Input() isFormTable: boolean = true;
  @Input() shouldGroupBy: boolean = false; // For mentalSymptom  and somaticSymptom tables
  // Emits events for form or Table to react 
  @Output() onEdit = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter();
  @Output() onDelete = new EventEmitter<MOnSectionEvent>();
  public selectedRow: any;

  constructor(
    public attrService: AttributesService,
    public menuService: MenuService,
    private cdRef: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.init();
  }

  private init(): void {
  }

  public onAddClick(): void {
    this.onEdit.emit(this.shouldGroupBy ? [] : {});
  }

  public onRowUnselect(event: any): void {
    this.selectedRow = null;
  }

  public onEditClick(): void {
    const editData = this.shouldGroupBy ? this.onSymptomEdit() : _.clone(this.selectedRow);
    this.onEdit.emit(editData);
    this.selectedRow = undefined;
  }

  public onDeleteClick(): void {
    if (this.isFormTable) {
      this.onDelete.emit(this.selectedRow);
      this.selectedRow = undefined;
      return;
    }

    const event = new MOnSectionEvent();
    event.data = this.selectedRow;
    event.successMessage = 'წარმატებით წაიშალა';
    this.selectedRow = undefined;
    this.onDelete.emit(event);
  }

  public onRowSelect(event: any) {
    this.selectedRow = this.shouldGroupBy ? event.data : this.data.find(e => e.generated_id == event.data.generated_id);
  }

  private onSymptomEdit() {
    return this.data.filter(e => this.selectedRow.records.some((record: any) => record.record_date === e.record_date))
  }
}
