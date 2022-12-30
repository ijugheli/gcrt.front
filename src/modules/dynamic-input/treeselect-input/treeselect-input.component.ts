import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import { MProperty } from 'src/services/attributes/models/property.model';
import { MPropertyValue } from 'src/services/attributes/models/property.value.model';
import { FormService } from 'src/services/form.service';

@Component({
  standalone: true,
  selector: 'treeselect-input',
  templateUrl: './treeselect-input.component.html',
  styleUrls: ['./treeselect-input.component.css'],
  imports: [CommonModule, FormsModule, TreeSelectModule, DropdownModule]
})
export class TreeselectInputComponent implements OnInit {
  @Input('property') public property!: MProperty;
  @Output('onChange') public onChange = new EventEmitter<MPropertyValue | null>();


  public selected: any[] = [];
  public style = { "width": "400px", "height": "100%" };
  public initialized: boolean = false;
  public options: any[] = [];


  constructor(private form: FormService) { }

  ngOnInit() {
    if (!this.property || this.property == null) {
      return;
    }

    this.initialized = true;
  }

  public valid() {
    if (!this.form.validation) {
      return true;
    }

    return this.selected != null && Object.values(this.selected).length > 0;
  }

  public onUpdate() {

  }

}
