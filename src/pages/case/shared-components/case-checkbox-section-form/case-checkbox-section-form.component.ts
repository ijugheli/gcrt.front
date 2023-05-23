import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MOnSectionEvent, MSymptom } from '../../case.model';
import { ICaseCol } from 'src/app/app.interfaces';
import { CaseSectionTable } from '../case-section-table/case-section-table.component';
import { CheckboxTable } from '../checkbox-table/checkbox-table.component';
import * as _ from 'lodash';
// For symptoms
@Component({
  standalone: true,
  selector: 'app-case-checkbox-section-form',
  templateUrl: './case-checkbox-section-form.component.html',
  styleUrls: ['./case-checkbox-section-form.component.scss', '../../../client/client-form/client-form.component.scss'],
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxTable, CaseSectionTable]
})

export class CaseCheckboxSectionForm implements OnInit {
  // Initial model data
  @Input() data: any[] = [];
  // Somatic/Mental TableOptions
  @Input() initialOptions: any[] = [];
  // Table Data
  @Input() parsedData: MSymptom[] = [];
  @Input() caseID: number | null = null;
  @Input() tableCols: ICaseCol[] = [];
  @Input() sectionType!: number;
  @Input() model: any[] = []; // for initializing case section in case table instead of form
  @Output() onSave = new EventEmitter<MOnSectionEvent>();
  @Output() onDelete = new EventEmitter<MOnSectionEvent>();
  // For local data (if caseID is null)
  public isAddMode: boolean = true;

  ngOnInit() {
    if (this.model !== null && this.model.length > 0) {
      this.isAddMode = false;
    }
  }

  public onSaveClick(event: MOnSectionEvent) {
    if (this.isAddMode && event.data !== undefined && this.parsedData.some((symptoms: any) => event.data[0].record_date === symptoms.record_date)) {
      event.errorMessage = 'არჩეულ თარიღში ჩანაწერი არსებობს';
    }

    this.isAddMode = true;
    this.onSave.emit(event);
  }

  public onEditClick(event: any) {
    this.model = event;
    this.isAddMode = false;
  }

  public onDeleteClick(selectedRow: any) {
    if (selectedRow == undefined) return;

    const event = new MOnSectionEvent();
    event.data = selectedRow;
    event.successMessage = 'ჩანაწერი წარმატებით წაიშალა';
    this.isAddMode = true;

    this.onDelete.emit(event);
  }

  public onAddClick(event: any) {
    this.model = event;
    this.isAddMode = true;
  }
}
