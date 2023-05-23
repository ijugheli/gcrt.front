import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { ICaseSharedSymptom, MCheckboxTableItem, MOnSectionEvent } from '../../case.model';
import { MOption } from 'src/services/attributes/models/option.model';
import { CustomInputComponent } from 'src/pages/client/custom-input/custom-input.component';
import { ICustomInput } from 'src/app/app.interfaces';
import { mentalSymptomMap } from '../../case-attrs/mental-symptom';
import { CaseService } from 'src/services/case.service';
import { CalendarModule } from 'primeng/calendar';
import * as _ from 'lodash';
// For Forms_of_violence and care_plan
@Component({
  standalone: true,
  selector: 'app-checkbox-table',
  templateUrl: './checkbox-table.component.html',
  styleUrls: ['./checkbox-table.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, CheckboxModule, SkeletonModule, CustomInputComponent, CalendarModule]
})

export class CheckboxTable<T extends ICaseSharedSymptom> implements OnInit, OnChanges {
  @Input() initialOptions: MOption[] = [];
  @Input() caseSectionModel: T[] = [];
  @Input() caseID: number | null = null;
  @Output() onSave = new EventEmitter<MOnSectionEvent>();
  public caseService: CaseService = inject(CaseService);
  public parsedOptions: MCheckboxTableItem[] = [];
  public isLoading: boolean = true;
  public symptomSeverityAttr: ICustomInput = mentalSymptomMap.get('symptom_severity');
  public dateAttr: ICustomInput = mentalSymptomMap.get('record_date');
  public dateModel: any;
  public todayDate: Date = new Date();

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['caseSectionModel'].currentValue !== undefined) {
      this.init();
    }
  }

  private init(shouldRefresh: boolean = false): void {
    this.isLoading = true;
    this.dateModel = undefined;
    this.caseSectionModel = shouldRefresh ? [] : _.cloneDeep(this.caseSectionModel);
    if (!_.isArray(this.caseSectionModel)) {
      this.caseSectionModel = [];
    }
    this.parsedOptions = this.parseModels(this.initialOptions);
    this.isLoading = false;
  }

  private parseModels(options: any[]): any[] {
    return options.map((option: any) => {
      const temp = new MCheckboxTableItem();
      temp.symptom_id = option.id;
      temp.symptom_severity = null;
      temp.title = option.name;
      temp.case_id = this.caseID ?? null;
      temp.isSelected = false;
      const model = this.caseSectionModel?.find(e => e.symptom_id === temp.symptom_id);

      if (model !== undefined) {
        this.dateModel = model.record_date;
        temp.record_date = model.record_date;
        temp.id = model.id ?? null;
        temp.symptom_severity = model.symptom_severity ?? null;
        temp.isSelected = true;
      }

      return temp;
    });
  }

  public isInputValid(): boolean {
    return this.dateModel != null;
  }

  public onDateChange(event: any) {
    this.dateModel = event;
  }

  public onComplete() {
    const onSectionSave: MOnSectionEvent = new MOnSectionEvent();
    const parsedModel = this.parseSaveData();

    this.caseService.isValidationEnabled = true;

    if (parsedModel.length === 0) {
      onSectionSave.errorMessage = 'მონიშნეთ მინიმუმ 1 სიმპტომი';
      this.onSave.emit(onSectionSave);
      return;
    } else if (!this.isValid(parsedModel)) {
      onSectionSave.errorMessage = 'აირჩიეთ სიმპტომის დონე და რეგისტრაციის თარიღი';
      this.onSave.emit(onSectionSave);
      return;
    }

    onSectionSave.data = parsedModel;
    this.onSave.emit(onSectionSave);
    this.init(true);
  }

  private parseSaveData() {
    const data: MCheckboxTableItem[] = _.cloneDeep(this.parsedOptions).filter(e => e.isSelected);
    data.forEach((e) => {
      e.record_date = this.dateModel;
    });
    return data;
  }

  private isValid(data: MCheckboxTableItem[]) {
    return data.filter(e => e.symptom_severity === null).length === 0 && this.dateModel;
  }
}
