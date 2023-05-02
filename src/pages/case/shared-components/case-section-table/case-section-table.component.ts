import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckboxModule } from 'primeng/checkbox';
import { ICaseCol } from 'src/app/app.interfaces';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MOnSectionEvent } from '../../case.model';
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
  @Input() parsedData: any[] = [];
  @Input() columns: ICaseCol[] = [];
  @Input() isFormTable: boolean = true;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter();
  @Output() onDelete = new EventEmitter<MOnSectionEvent>();
  public loading: boolean = true;
  public selectedRow: any;
  public checked: boolean = false;

  constructor(
    public attrService: AttributesService,
    public ref: DynamicDialogRef,
    public dialog: DynamicDialogConfig,

  ) { }

  ngOnInit() {
    this.init();
  }

  private init(): void {
    this.loading = false;
  }

  public onAddClick(): void {
    this.onAdd.emit();
  }

  public onEditClick(): void {
    this.onEdit.emit(Object.assign({}, this.selectedRow));
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
    this.selectedRow = this.data.find(e => e.generated_id == event.data.generated_id);
  }
}
