import { Component, Input, OnInit } from '@angular/core';
import { TABLE_SETTINGS } from 'src/app/app.config';
import { IActionItem } from 'src/app/app.interfaces';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent implements OnInit {
  @Input('selectedRows') public selectedRows : any;
  /**
   * Settings for action buttons on top of the table. 
   */
   public settings: Map<String, IActionItem> = TABLE_SETTINGS;

  constructor() { }

  ngOnInit() {
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

  public onSettingClick(setting: string): void {
    if (setting == 'add') {
      this.add();
    }

    if (setting == 'delete') {
      this.delete();
    }

    if (setting == 'pdf') {
      console.log('HERE');
      this.exportPdf();
    }

    if (setting == 'xls') {
      this.exportExcel();
    }
  }

  //Export Related
  public exportPdf() {
    let columns = [this.properties.map((item) => item.title)];
    let body = Object.values(this.originalRows).map<RowInput>((item) => Object.values(item));

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
    let body = this.originalRows.map<RowInput>((item: { [key: number]: string | string[] }) => {
      let row: { [key: string]: string | string[] } = {};
      for (let i in item) {
        if (!this.propMap[i])
          continue;
        let prop: Property = this.propMap[i];
        let value: string = (prop.isSelect() && item[i].length > 0)
          ? (Array.from(item[i])).join(',')
          : item[i] as string;
        row[this.propMap[i].title] = value;
      }
      return row;
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(body);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "rows");
    });
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
