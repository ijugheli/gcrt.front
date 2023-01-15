import { Injectable } from '@angular/core';
import { FilterService, ConfirmationService, MessageService } from 'primeng/api';
import { ACTION_SETTINGS, TABLE_SETTINGS } from 'src/app/app.config';
import { MRecord } from './attributes/models/record.model';
import { AttributesService } from './attributes/Attributes.service';
import { MAttribute } from './attributes/models/attribute.model';
import { RecordsService } from './attributes/Records.service';
import { MProperty } from './attributes/models/property.model';
import { MOption } from './attributes/models/option.model';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicFormComponent } from 'src/modules/dynamic-form/dynamic-form.component';
import autoTable, { RowInput } from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { IActionItem } from 'src/app/app.interfaces';

@Injectable({
  providedIn: 'any',
})
export class DataTableService {
  public settings = {
    'sort': true,
    'filter': true,
    'multi': true,
    'header': true
  };

  public headerSettings: Map<String, IActionItem> = TABLE_SETTINGS;

  public attrID?: number;
  public attribute?: MAttribute;
  public records: MRecord[] = [];
  public originalRecords: MRecord[] = [];

  public selected: MRecord[] = [];

  public filterOptions: any = ACTION_SETTINGS;

  constructor(
    private filterService: FilterService,
    private attributes: AttributesService,
    private recordsService: RecordsService,
    private router: Router,
    private dialog: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.initializeFilterOptions();
  }

  public onFilter = {
    select: (property: MProperty) => {
      if (!property.hasSelectedOptions()) {
        this.records = [...this.originalRecords];
        return;
      }

      this.records = this.records.filter((record) => {
        if (!property.id || !record.propValueMap.hasOwnProperty(property.id)) {
          return false;
        }

        let propertyValue = record.propValueMap[property.id];

        if (!propertyValue || !propertyValue.length) {
          return false;
        }

        if (Array.isArray(propertyValue)) {
          return propertyValue.some(
            (value: string) => property.isValueSelected(value)
          );
        }

        return property.isValueSelected(propertyValue);
      });
    },

  }

  public async init(attrID: number) {
    this.attrID = attrID;

    await this.loadAttribute();

    if (!this.attribute)
      return;

    await this.loadRecords();
  }

  private async loadAttribute() {
    if (!this.attrID)
      return;

    this.attribute = await this.attributes.get(this.attrID);
  }

  private async loadRecords() {
    if (!this.attribute)
      return;

    this.originalRecords = await this.recordsService.get(this.attribute.id);
    this.records = [...this.originalRecords];
  }


  public onAddRecord() {
    if (this.attribute?.isEntity()) {
      this.router.navigateByUrl('/add/' + this.attribute.id);
      return;
    }

    let preDefined;

    // if (this.record !== undefined && row != null) {
    //   preDefined = [
    //     {
    //       'key': 'p_value_id',
    //       'value': row['value_id'],
    //       'label': Object.values(row)[0],
    //       'type': 'apply' //apply/append
    //     }
    //   ];
    // }

    const dialogReference = this.dialog.open(DynamicFormComponent, {
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

  public onEditRecord() {
    if (!this.selected || this.selected.length > 1) {
      return;
    }

    let valueID = this.selected[0]['valueID'];

    if (this.attribute?.isEntity()) {
      this.router.navigateByUrl('/edit/' + this.attribute.id + '/' + valueID);
      return;
    }

    //@TODO uncomment valueID and relatedValueID
    const dialogReference = this.dialog.open(DynamicFormComponent, {
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

  public onDeleteRecords() {

    if (!this.selected || this.selected == null || this.selected.length <= 0) {
      return;
    }

    let valueIDs = Array.from(this.selected.map((record: MRecord) => record.valueID));

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





















  private initializeFilterOptions() {
    //String Services
    this.filterService.register('custom-contains', (value: any, filter: any): boolean => this.filterService.filters.contains(value, filter));
    this.filterService.register('custom-notContains', (value: any, filter: any): boolean => this.filterService.filters.notContains(value, filter));
    this.filterService.register('custom-equals', (value: any, filter: any): boolean => this.filterService.filters.equals(value, filter));
    this.filterService.register('custom-notEquals', (value: any, filter: any): boolean => this.filterService.filters.notEquals(value, filter));
    this.filterService.register('custom-startsWith', (value: any, filter: any): boolean => this.filterService.filters.startsWith(value, filter));
    this.filterService.register('custom-endsWith', (value: any, filter: any): boolean => this.filterService.filters.endsWith(value, filter));
    //Date Services
    this.filterService.register('custom-dateIs', (value: any, filter: any): boolean => this.filterService.filters.dateIs(value, filter));
    this.filterService.register('custom-dateIsNot', (value: any, filter: any): boolean => this.filterService.filters.dateIsNot(value, filter));
    this.filterService.register('custom-dateAfter', (value: any, filter: any): boolean => this.filterService.filters.dateAfter(value, filter));
    this.filterService.register('custom-dateBefore', (value: any, filter: any): boolean => this.filterService.filters.dateBefore(value, filter));
    //Integer Services
    this.filterService.register('custom-greaterThen', (value: any, filter: any): boolean => {
      if (filter == undefined || filter == null || (typeof filter == 'string' && filter.trim() == '')) {
        return true;
      }

      if (value == undefined || value == null) {
        return false;
      }

      if (parseInt(filter) < parseInt(value)) {
        return true;
      }

      return false;
    });
    this.filterService.register('custom-lessThen', (value: any, filter: any): boolean => {
      if (filter == undefined || filter == null || (typeof filter == 'string' && filter.trim() == '')) {
        return true;
      }

      if (value == undefined || value == null) {
        return false;
      }

      if (parseInt(filter) > parseInt(value)) {
        return true;
      }

      return false;
    });
  }


  //Settings Related
  public onSettingClick(setting: string): void {
    if (setting == 'add') {
      this.onAddRecord();
    }

    if (setting == 'edit') {
      this.onEditRecord();
    }

    if (setting == 'delete') {
      this.onDeleteRecords();
    }

    if (setting == 'pdf') {
      // this.exportPdf();
    }

    if (setting == 'xls') {
      // this.exportExcel();
    }
  }

  public isSettingEnabled(action: string): boolean {
    if (!this.headerSettings.has(action)) {
      return true;
    }

    let settings = this.headerSettings.get(action);

    if (settings == null || settings == undefined) {
      return false;
    }

    if (this.multipleSelected()) return settings.activeOnMulti;
    if (this.singleSelected()) return settings.activeOnSingle;

    return settings.activeDefault;
  }

  public multipleSelected() {
    if (this.selected == undefined || this.selected == null) {
      return false;
    }

    return typeof this.selected == 'object' && this.selected.length > 1;
  }

  public singleSelected() {
    if (this.selected == undefined || this.selected == null) {
      return false;
    }

    return typeof this.selected == 'object' && this.selected.length == 1;
  }




  public reload() {
    window.location.reload();
  }




  //Export Related
  public exportPdf() {
    if (!this.attribute) {
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
