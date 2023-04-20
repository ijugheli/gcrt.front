import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { IConsultation, IDiagnosis, IReferral, MOnSectionEvent } from '../../case.model';
import { CheckboxModule } from 'primeng/checkbox';
import { ICaseCol, ICustomInput } from 'src/app/app.interfaces';
import { caseSectionFormTypes } from '../../case.config';
import { CustomInputComponent } from 'src/pages/client/custom-input/custom-input.component';
import { CaseSectionTable } from '../case-section-table/case-section-table.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CaseService } from 'src/services/case.service';
// For diagnosis, consultation, referral,
@Component({
  standalone: true,
  selector: 'app-case-section-form',
  templateUrl: './case-section-form.component.html',
  styleUrls: ['./case-section-form.component.scss', '../../../client/client-form/client-form.component.scss'],
  imports: [CommonModule, FormsModule, ButtonModule, CustomInputComponent, CaseSectionTable, ConfirmDialogModule]
})

export class CaseSectionForm implements OnInit {
  @Input() data: any[] = [];
  @Input() caseID: number | null = null;
  @Input() inputAttrs: ICustomInput[] = [];
  @Input() tableCols: ICaseCol[] = [];
  @Input() sectionType!: number;
  @Output() onSave = new EventEmitter<MOnSectionEvent>();
  @Output() onDelete = new EventEmitter<MOnSectionEvent>();
  isDialogEnabled: boolean = false;

  model!: IDiagnosis | IConsultation | IReferral;

  constructor(
    private attrService: AttributesService,
    private caseService: CaseService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.model = this.getModel();
  }

  public onSaveClick() {
    if (!this.caseService.isValidNewModel(this.model)) {
      return;
    }

    const id = this.model.id ?? this.model.generated_id;
    const index = this.data.findIndex(e => e.generated_id == id || e.id == id);
    const onSectionSave = new MOnSectionEvent();

    if (!this.caseService.isValidModel(this.model, this.inputAttrs)) {
      onSectionSave.errorMessage = 'შეავსეთ სავალდებულო ველები';
      this.onSave.emit(onSectionSave);
      return;
    }

    this.caseService.isValidationEnabled = false;
    this.model.case_id = this.caseID;

    if (index !== -1) {
      this.data[index] = Object.assign({}, this.model);
    } else {
      this.data.push(this.model);
    }

    onSectionSave.data = this.data;
    onSectionSave.model = this.model;
    onSectionSave.successMessage = 'წარმატებით დაემატა';
    this.model = Object.assign({}, this.getModel());
    this.onSave.emit(onSectionSave);
  }

  public onDeleteClick(selectedRow: any): void {
    if (selectedRow == undefined) return;

    const event = new MOnSectionEvent();
    event.data = selectedRow;
    event.successMessage = 'ჩანაწერი წარმატებით წაიშალა';

    this.onDelete.emit(event);
  }

  private getModel(): IDiagnosis | IConsultation | IReferral {
    if (caseSectionFormTypes[this.sectionType] == 'diagnosis') {
      return new IDiagnosis();
    } else if (caseSectionFormTypes[this.sectionType] == 'referral') {
      return new IReferral();
    }

    return new IConsultation();
  }
}
