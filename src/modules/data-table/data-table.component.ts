import { Attribute, Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, FilterService, SelectItem } from 'primeng/api';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { IActionItem, RowItem } from 'src/app/app.interfaces';
import { ACTION_SETTINGS, DATA_TYPE_ID, TABLE_SETTINGS, VIEW_TYPE_ID } from 'src/app/app.config';
import { DUMMY_USERS, STAFF_TYPES } from 'src/app/app.seeds';
import { AttributesService } from '../../services/Attributes.service';
import { AttrValue, AttrProperty } from '../../app/app.models';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';



class Column {
  filterType?: number = 1;
  property?: AttrProperty;
  rows?: any[];
}

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  providers: [DialogService, MessageService]
})
export class DataTableComponent implements OnInit {
  @Input('attrID') public attrID!: any;
  /**
   * List of existing rows.
   */


  public selectedColumns: any;
  /**
   * Current list of selected rows
   */
  public selectedRows: any;
  /**
   * Options of custom filters
   */
  public filterOptions: any = ACTION_SETTINGS;
  /**
   * Settings for action buttons on top of the table. 
   */
  public settings: Map<String, IActionItem> = TABLE_SETTINGS;

  /**
   * DUMMY DATA
   */
  public typeDefinitions: Map<number, string> = STAFF_TYPES;
  public types = Array.from(this.typeDefinitions.keys());
  /**
   * DUMMY DATA
   */

  public multiSelectValue: any;

  public loaded: boolean = false;

  public properties: any[] = [];
  public originalProps: any[] = [];
  public originalRows: any[] = [];
  public rows: any[] = [];
  public propMap: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private filterService: FilterService,
    private messageService: MessageService,
    private attrsService: AttributesService,
    public dialogService: DialogService,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    this.initializeFilterOptions();
    this.attrID = parseInt(this.attrID);
    this.load();
  }

  private load() {
    this.loaded = false;
    this.spinner.show();
    this.attrsService.full(this.attrID)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.loaded = true;
        this.parseProperties(data);
        this.parseRows(data);
      });
  }

  private parseProperties(data: any) {
    if (!data || !data['properties']) {
      return;
    }

    for (let i in data['properties']) {
      this.propMap[data['properties'][i]['id']] = data['properties'][i];
    }

    this.originalProps = data['properties']
      .filter((i: any) => i.type == 1)
      .sort((a: any, b: any) => a.order_id > b.order_id ? 1 : -1)
      .map((prop: any) => {
        prop['field'] = 'name';
        prop['header'] = prop.title;
        prop.options = {
          'list': [],
          'values': {}
        };
        if (!prop.source)
          return prop;


        for (let i = 0; i < prop.source.length; i++) {
          let item = prop.source[i];
          prop.options.list.push(item.value);
        }
        prop.optValues = prop.source.map((item: any) => item.id);


        return prop;
      });

    this.properties = this.originalProps.filter((i) => i.has_filter > 0);
    console.log(this.properties);
  }


  private parseRows(data: any) {
    if (!data || !data['rows']) {
      return;
    }
    this.originalRows = data['rows'];
    this.rows = data['rows'];
  }






  public isStringFilter(property: AttrProperty): boolean {
    if (!property.id) return false;

    let viewTypeID = this.propMap[property.id].input_view_type;
    let dataTypeID = this.propMap[property.id].input_data_type;

    return (dataTypeID == DATA_TYPE_ID('string')) &&
      viewTypeID != VIEW_TYPE_ID('select') &&
      viewTypeID != VIEW_TYPE_ID('multiselect');
  }

  public isDateFilter(property: AttrProperty): boolean {
    if (!property.id) return false;

    let viewTypeID = this.propMap[property.id].input_view_type;
    let dataTypeID = this.propMap[property.id].input_data_type;

    return (dataTypeID == DATA_TYPE_ID('date')) ||
      viewTypeID == VIEW_TYPE_ID('datetime');
  }

  public isSelectFilter(property: AttrProperty): boolean {
    if (!property.id) return false;

    let viewTypeID = this.propMap[property.id].input_view_type;
    let dataTypeID = this.propMap[property.id].input_data_type;
    if (!this.propMap[property.id].source)

      return false;
    return (dataTypeID == DATA_TYPE_ID('select')) ||
      viewTypeID == VIEW_TYPE_ID('multiselect');
  }

  public filterString(e: any, a: any, b: any) {
    console.log('Filtering String');
    console.log(e);
    console.log(a);
    console.log(b);
    console.log('Filtering String');
  }










  filter(e: any) {
    console.log('Filter');
    console.log(e);
    console.log('Filter');
  }


  public filterCallback(e: any) {
    console.log('Filter Callback');
    console.log(e);
    console.log('Filter Callback');
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
    // this.filterService.register('custom-lessThen', (value: any, filter: any): boolean => this.filterService.filters.dateBefore(value, filter));
  }



  //Action Settings related.
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

  onSettingClick(setting: string): void {
    console.log(setting);
    if (setting == 'add') {
      this.add();
    }

    if (setting == 'delete') {
      this.delete();
    }
  }

  private delete() {
    if (!this.selectedRows || this.selectedRows == null || this.selectedRows.length <= 0) {
      return;
    }

    let valueIDs = Array.from(this.selectedRows.map((i: any) => i.valueID));

    this.confirmationService.confirm({
      header: 'ჩანაწერების წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერების წაშლა?',
      accept: () => {
        this.attrsService.delete(this.attrID, JSON.stringify(valueIDs)).subscribe((d) => {
          this.messageService.add({ severity: 'success', summary: 'შერჩეული ჩანაწერების წაშლა წარმატებით დასრულდა' });
          this.load();
        });
      }, reject: () => {

      }
    });
  }



  private add() {
    const dialogReference = this.dialogService.open(DynamicFormComponent, {
      data: { attrID: this.attrID },
      header: 'დამატება',
      width: '60%',
      position: 'top'
    });

    dialogReference.onClose.subscribe((d: any) => {
      this.load();
    });
  }



  public onRowSelect(event: any) {
    console.log(this.selectedRows);
  }

  public onRowUnselect(event: any) {
    console.log(this.selectedRows);
  }

  confirm() {

  }
























  //Export Related
  exportPdf() {
    let columns = [['დასახელება', 'აღწერა', 'თარიღი']];
    let body = this.rows.map((i) => [i.title, i.description, i.date])

    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('l', 'mm', 'a4');
        // doc.addFileToVFS("assets/fonts/helvetica-neue-lt-geo-55-roman.ttf", myFont);
        // doc.addFont("MyFont.ttf", "MyFont", "normal");
        // doc.setFont("MyFont");

        //         autoTable(doc, {
        //           head: columns,
        //           body: body,
        //           styles: {
        //             font: "sans-serif",
        // fontStyle: 'bold',
        //           },
        //           didDrawCell: (data) => {
        //             console.log(data);
        //           },
        //         });

        //         doc.save('rows.pdf');
      })
    })
  }


  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.rows);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "rows");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }



  // private parseRows(data: any): void {
  //   // console.log(data);
  //   if (!data || !data['rows']) {
  //     return;
  //   }

  //   let rows = data['rows'];
  //   for (let i in data['rows']) {
  //     let cRow = {
  //       'id': i,
  //       'propMap': data['rows'][i]
  //     }
  //     this.rows.push(cRow);
  //   }
  // }



  // public rowValue(row: any, propertyID: any) {
  //   console.log(row);
  //   console.log(row.propMap);
  //   console.log(propertyID);
  //   row = row.propMap[propertyID];
  //   if (row == undefined || row == null) {
  //     return '';
  //   }

  //   let viewTypeID = this.propMap[propertyID].input_view_type;
  //   let dataTypeID = this.propMap[propertyID].input_data_type;

  //   if (viewTypeID == VIEW_TYPE_ID('select') ||
  //     viewTypeID == VIEW_TYPE_ID('multiselect') ||
  //     viewTypeID == VIEW_TYPE_ID('treeselect') ||
  //     viewTypeID == VIEW_TYPE_ID('tableselect')) {
  //     return row.selected.join(', ');
  //   }

  //   if (viewTypeID == VIEW_TYPE_ID('textarea') ||
  //     viewTypeID == VIEW_TYPE_ID('editable-textarea')) {
  //     // console.log(row);
  //     return row.value_text == null ? '' : row.value_text.replace(/<\/?[^>]+(>|$)/g, "");
  //   }

  //   if (dataTypeID == DATA_TYPE_ID('string')) return row.value_string;
  //   if (dataTypeID == DATA_TYPE_ID('date')) return row.value_date;
  //   if (dataTypeID == DATA_TYPE_ID('datetime')) return row.value_date;
  //   if (dataTypeID == DATA_TYPE_ID('boolean')) return row.value_boolean == 1 ? 'კი' : 'არა';

  // }



}
