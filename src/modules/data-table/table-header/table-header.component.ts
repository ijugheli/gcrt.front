import { Component, Input, OnInit } from '@angular/core';
import { TABLE_SETTINGS } from 'src/app/app.config';
import { IActionItem } from 'src/app/app.interfaces';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { MAttribute } from '../../../services/attributes/models/attribute.model';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicFormComponent } from 'src/modules/dynamic-form/dynamic-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import autoTable, { RowInput } from 'jspdf-autotable';
import { DataTableService } from '../../../services/table.service';
@Component({
  selector: 'datatable-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent implements OnInit {
  @Input('attribute') public attribute?: MAttribute;


  /**
   * Settings for action buttons on top of the table. 
   */
  public settings: Map<String, IActionItem> = TABLE_SETTINGS;

  constructor(
    public table: DataTableService,
  ) { }

  ngOnInit() {
  }




}
