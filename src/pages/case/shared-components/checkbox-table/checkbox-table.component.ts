import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
// For Forms_of_violence and care_plan
@Component({
  standalone: true,
  selector: 'app-checkbox-table',
  templateUrl: './checkbox-table.component.html',
  styleUrls: ['./checkbox-table.component.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, CheckboxModule, BadgeModule, SkeletonModule, CustomInputComponent]
})

export class CheckboxTable<T extends ICaseSharedSymptom> implements OnInit, OnChanges {
@Input() initialOptions: MOption[] = [];
  @Input() caseSectionModel: T[] = [];
  @Input() caseID: number | null = null;
  @Output() onSave = new EventEmitter<any[]>();
  public parsedOptions: MCheckboxTableItem[] = [];
  public isLoading: boolean = true;
  public symptomSeverityAttr: ICustomInput = mentalSymptomMap.get('symptom_severity');

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
    console.log(this.initialOptions)
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
      const model = this.caseSectionModel.find(e => e.symptom_id === temp.symptom_id);

      if (model !== undefined) {
        temp.id = model.id ?? null;
        temp.isSelected = true;
      }

      return temp;
    });
  }

  public onComplete() {
    const parsedModel = this.parsedOptions.filter(e => e.isSelected);

    this.onSave.emit(parsedModel);
  }
}
