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

  constructor(private router: Router,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private attributes: AttributesService,
    private messageService: MessageService,
    public table: DataTableService,
  ) { }

  ngOnInit() {
  }




  public add(row: any = null) {
    if (this.attribute?.isEntity()) {
      this.router.navigateByUrl('/add/' + this.attribute.id);
      return;
    }

    let preDefined;

    if (row !== undefined && row != null) {
      preDefined = [
        {
          'key': 'p_value_id',
          'value': row['value_id'],
          'label': Object.values(row)[0],
          'type': 'apply' //apply/append
        }
      ];
    }

    const dialogReference = this.dialogService.open(DynamicFormComponent, {
      data: {
        attrID: this.attribute?.id,
        // relatedValueID: this.valueID,
        // preDefined: preDefined
      },
      header: 'მნიშვნელობის დამატება',
      dismissableMask: true,
      maximizable: true,
      width: '60%',
      position: 'top'
    });

    dialogReference.onClose.subscribe((d: any) => {
      //Nothing to do?
      // this.load();
    });
  }

  private edit() {
    if (!this.table.selected || this.table.selected.length > 1) {
      return;
    }

    let valueID = this.table.selected[0]['valueID'];

    if (this.attribute?.isEntity()) {
      this.router.navigateByUrl('/edit/' + this.attribute.id + '/' + valueID);
      return;
    }
    //@TODO uncomment valueID and relatedValueID
    const dialogReference = this.dialogService.open(DynamicFormComponent, {
      data: {
        attrID: this.attribute?.id,
        // valueID: valueID, 
        // relatedValueID: this.valueID 
      },
      header: 'მნიშვნელობის რედაქტირება',
      dismissableMask: true,
      maximizable: true,
      width: '60%',
      position: 'top'
    });

    dialogReference.onClose.subscribe((d: any) => {
      //Nothing to do?
      // this.load();
    });
  }

  public delete(row: any = null) {
    let rows = (row != null && row['value_id'])
      ? [{ 'valueID': row['value_id'] }]
      : this.table.selected;

    if (!rows || rows == null || rows.length <= 0) {
      return;
    }

    let valueIDs = Array.from(rows.map((i: any) => i.valueID));

    this.confirmationService.confirm({
      header: 'ჩანაწერების წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერების წაშლა?',
      accept: () => {
        if (!this.attribute) {
          return;
        }

        this.attributes.delete(this.attribute.id, JSON.stringify(valueIDs)).subscribe((d) => {
          this.messageService.add({
            severity: 'success',
            summary: 'შერჩეული ჩანაწერების წაშლა წარმატებით დასრულდა'
          });
          // this.load();
        });
      }, reject: () => {

      }
    });
  }






















}
