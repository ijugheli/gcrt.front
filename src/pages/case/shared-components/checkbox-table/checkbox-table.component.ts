import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { flattenTree } from 'src/app/app.func';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { CaseSharedInterface, ICaseSharedSymptom, MCheckboxTableItem, MTreeCheckboxTableItem } from '../../case.model';
import { MOption } from 'src/services/attributes/models/option.model';
import { CustomInputComponent } from 'src/pages/client/custom-input/custom-input.component';
import { ICustomInput } from 'src/app/app.interfaces';
import { mentalSymptomMap } from '../../case-attrs/mental-symptom';
import { CaseService } from 'src/services/case.service';
import { CalendarModule } from 'primeng/calendar';
// For Forms_of_violence and care_plan
@Component({
  standalone: true,
  selector: 'app-checkbox-table',
  templateUrl: './checkbox-table.component.html',
  styleUrls: ['./checkbox-table.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, CheckboxModule, BadgeModule, SkeletonModule, CustomInputComponent, CalendarModule]
})

export class CheckboxTable<T extends ICaseSharedSymptom> implements OnInit, OnChanges {
  @Input() initialOptions: MOption[] = [];
  @Input() caseSectionModel: T[] = [];
  @Input() caseID: number | null = null;
  @Output() onSave = new EventEmitter<any[]>();
  public caseService: CaseService = inject(CaseService);
  public parsedOptions: MCheckboxTableItem[] = [];
  public isLoading: boolean = true;
  public symptomSeverityAttr: ICustomInput = mentalSymptomMap.get('symptom_severity');
  public dateAttr: ICustomInput = mentalSymptomMap.get('registration_date');
  public dateModel: any;
  public todayDate: Date = new Date();

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['caseSectionModel'].currentValue.length > 0) {
      this.init();
    }
  }

  private init(): void {
    this.isLoading = true;
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
      const model = this.caseSectionModel.find(e => e.symptom_id === temp.symptom_id);

      if (model !== undefined) {
        temp.id = model.id ?? null;
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
    this.parsedOptions.forEach((e) => {
      e.registration_date = this.dateModel;
    })
  }

  public onComplete() {
    const parsedModel = this.parsedOptions.filter(e => e.isSelected);

    this.onSave.emit(parsedModel);
  }
}
