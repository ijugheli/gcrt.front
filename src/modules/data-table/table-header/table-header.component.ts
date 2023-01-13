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
@Component({
  selector: 'datatable-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent implements OnInit {
  @Input('selectedRows') public selectedRows: any;

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
  ) { }

  ngOnInit() {
  }


  public onSettingClick(setting: string): void {
    if (setting == 'add') {
      this.add();
    }

    if (setting == 'edit') {
      this.edit();
    }

    if (setting == 'delete') {
      this.delete();
    }

    if (setting == 'pdf') {
      this.exportPdf();
    }

    if (setting == 'xls') {
      this.exportExcel();
    }
  }

  public isSettingEnabled(action: string): boolean {
    if (!this.settings.has(action)) {
      return true;
    }

    let settings = this.settings.get(action);

    if (settings == null || settings == undefined) {
      return false;
    }

    if (this.multipleSelected()) return settings.activeOnMulti;
    if (this.singleSelected()) return settings.activeOnSingle;

    return settings.activeDefault;
  }

  public multipleSelected() {
    if (this.selectedRows == undefined || this.selectedRows == null) {
      return false;
    }

    return typeof this.selectedRows == 'object' && this.selectedRows.length > 1;
  }

  public singleSelected() {
    if (this.selectedRows == undefined || this.selectedRows == null) {
      return false;
    }

    return typeof this.selectedRows == 'object' && this.selectedRows.length == 1;
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
    if (!this.selectedRows || this.selectedRows.length > 1) {
      return;
    }

    let valueID = this.selectedRows[0]['valueID'];

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
      : this.selectedRows;

    if (!rows || rows == null || rows <= 0) {
      return;
    }

    let valueIDs = Array.from(rows.map((i: any) => i.valueID));

    this.confirmationService.confirm({
      header: 'ჩანაწერების წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერების წაშლა?',
      accept: () => {
        if(!this.attribute) {
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

  public reload() {
    window.location.reload();
  }


    //Export Related
    public exportPdf() {
      if(!this.attribute) {
        return;
      }
      
      let columns = [this.attribute.properties.map((item) => item.title)];
      let body = Object.values(this.attribute.rows).map<RowInput>((item) => Object.values(item));
  
      import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
          const doc = new jsPDF.default('l', 'mm', 'a4');
          doc.addFont("assets/fonts/helvetica-neue-lt-geo-55-roman.ttf", "roman", "normal");
          autoTable(doc, {
            head: columns,
            body: body,
            styles: {
              font: 'roman',
              fontStyle: 'bold',
            }
          });
          doc.setFont("roman");
          doc.save('rows.pdf');
        })
      })
    }
  
    public exportExcel() {
      // let body = this.attribute.properties.map<RowInput>((item: { [key: number]: string | string[] }) => {
      //   let row: { [key: string]: string | string[] } = {};
      //   for (let i in item) {
      //     if (!this.propMap[i])
      //       continue;
      //     let prop: Property = this.propMap[i];
      //     let value: string = (prop.isSelect() && item[i].length > 0)
      //       ? (Array.from(item[i])).join(',')
      //       : item[i] as string;
      //     row[this.propMap[i].title] = value;
      //   }
      //   return row;
      // });
  
      // import("xlsx").then(xlsx => {
      //   const worksheet = xlsx.utils.json_to_sheet(body);
      //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      //   this.saveAsExcelFile(excelBuffer, "rows");
      // });
    }
  
    public saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

  



}
