import { Attribute, Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, FilterService, MenuItem, SelectItem } from 'primeng/api';
import * as FileSaver from 'file-saver';
import autoTable, { RowInput } from 'jspdf-autotable';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { IActionItem, RowItem } from 'src/app/app.interfaces';
import { ACTION_SETTINGS, DATA_TYPE_ID, TABLE_SETTINGS, VIEW_TYPE_ID } from 'src/app/app.config';
import { DUMMY_USERS, STAFF_TYPES } from 'src/app/app.seeds';
import { AttributesService } from '../../services/Attributes.service';
import { AttrValue, Property, AttrProperty } from '../../app/app.models';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { ATTR_TYPES } from '../../app/app.config';


import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  providers: [DialogService, MessageService]
})
export class DataTableComponent implements OnInit {
  @Input('attrID') public attrID!: any;
  @Input('valueID') public valueID!: any;
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

  public showHeader = false;

  public tableSettings = {
    'sort': true,
    'filter': true,
    'multi': true,
    'header': true
  }

  public isTree = false;
  public tree: TreeNode[] = [];
  public selectedNode: TreeNode | null = null;
  public items: MenuItem[] = [];
  public attribute: any;

  constructor(
    private confirmationService: ConfirmationService,
    private filterService: FilterService,
    private messageService: MessageService,
    private attrsService: AttributesService,
    private router: Router,
    public dialogService: DialogService,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    this.initializeFilterOptions();
    this.attrID = parseInt(this.attrID);
    this.initState();
    this.load();
    this.loadContextMenu();
  }

  private initState() {
  }

  private loadContextMenu() {
    this.items = [
      {
        label: 'View', icon: 'pi pi-search', command: (event) => {
          console.log('View');
        }
      },
      {
        label: 'Toggle', icon: 'pi pi-sort', command: (event) => {
          console.log('HERE');
        }
      }
    ];
  }

  private load() {
    this.loaded = false;
    this.spinner.show();

    if (this.valueID != null) {
      console.log('VALUUEE');
      console.log(this.valueID);
      this.attrsService.related(this.attrID, this.valueID)
        .subscribe((data: any) => {
          this.spinner.hide();
          this.loaded = true;
          this.attribute = data;
          this.processAttribute(data);
          this.parseProperties(data);
          this.parseRows(data);
        });
      return;
    }



    this.attrsService.full(this.attrID)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.loaded = true;
        this.attribute = data;
        this.processAttribute(data);
        this.parseProperties(data);
        this.parseRows(data);
      });
  }

  private processAttribute(data: any) {
    if (!data || typeof data['type'] == 'undefined' || data['type'] == undefined) {
      return;
    }

    this.isTree = data['type'] && data['type'] == ATTR_TYPES.get('tree');
    this.parseProperties(data);
    if (this.isTree) {

      this.tree = this.parseTree(data['tree']);
      console.log(this.tree);
      return;
    }

    this.parseRows(data);
  }

  private parseTree(tree: any) {
    return (Array.from(Object.values(tree)) as TreeNode[]).map((node: any) => {
      if (node.children) {
        node.children = this.parseTree(node.children);
      }

      return node;
    });
  }

  private parseProperties(data: any) {
    if (!data || !data['properties']) {
      return;
    }

    for (let i in data['properties']) {
      this.propMap[data['properties'][i]['id']] = new Property(data['properties'][i] as AttrProperty);
    }

    this.originalProps = data['properties']
      .filter((i: any) => i.type == 1)
      .sort((a: any, b: any) => a.order_id > b.order_id ? 1 : -1)
      .map((prop: any) => new Property(prop as AttrProperty));

    this.properties = this.originalProps.filter((i) => i.has_filter > 0);
  }

  private parseRows(data: any) {
    if (!data || !data['rows']) {
      return;
    }
    this.originalRows = data['rows'];
    this.rows = data['rows'];
  }

  public reload() {
    window.location.reload();
  }

  public filter(e: any) {
    console.log('Filtering select filter');
    console.log(e);
    console.log('Filter');
  }

  public onSelectChange(prop: Property) {
    if (!prop.hasSelectedOptions()) {
      this.rows = this.originalRows;
      return;
    }

    this.rows = this.rows.filter((row) => {
      if (!prop.id || !row.hasOwnProperty(prop.id)) {
        return false;
      }

      let propertyValue = row[prop.id];

      if (!propertyValue || !propertyValue.length) {
        return false;
      }

      return propertyValue.some(
        (value: string) => prop.selectedOptions.indexOf(value) > -1
      );
    });

  }

  //Row controls and Filtering
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

  public onRowSelect(event: any) {
    console.log(this.selectedRows);
  }

  public onRowUnselect(event: any) {
    console.log(this.selectedRows);
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

  private isEntity() {
    if (this.attribute == null || this.attribute.type == null) {
      return false;
    }

    return this.attribute.type === ATTR_TYPES.get('entity');
  }

  //Action Methods
  private add() {
    if (this.isEntity()) {
      this.router.navigateByUrl('/add/' + this.attrID);
      return;
    }


    const dialogReference = this.dialogService.open(DynamicFormComponent, {
      data: { attrID: this.attrID, relatedValueID: this.valueID },
      header: 'მნიშვნელობის დამატება',
      dismissableMask: true,
      maximizable: true,
      width: '60%',
      position: 'top'
    });

    dialogReference.onClose.subscribe((d: any) => {
      this.load();
    });
  }

  private edit() {
    if (!this.selectedRows || this.selectedRows.length > 1) {
      return;
    }

    let valueID = this.selectedRows[0]['valueID'];

    if (this.isEntity()) {
      this.router.navigateByUrl('/edit/' + this.attrID + '/' + valueID);
      return;
    }
    const dialogReference = this.dialogService.open(DynamicFormComponent, {
      data: { attrID: this.attrID, valueID: valueID, relatedValueID: this.valueID },
      header: 'მნიშვნელობის რედაქტირება',
      dismissableMask: true,
      maximizable: true,
      width: '60%',
      position: 'top'
    });

    dialogReference.onClose.subscribe((d: any) => {
      this.load();
    });
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


  onTreeCellChange(value: any, propertyID: any, row: any) {
    value = typeof value === 'string' ? value : value.target.value;
    const data = {
      'value_id': row['value_id'],
      'attr_id': this.attrID,
      'property_id': propertyID,
      'value': value
      // 'value': value
    };

    this.spinner.show();
    this.attrsService.editValueItem(data).subscribe((response) => {
      this.messageService.add({ severity: 'success', summary: 'მნიშვნელობა წარმატებით შეიცვალა.' });
      this.spinner.hide();
    }, (err) => {
      this.messageService.add({ severity: 'warning', summary: 'მნიშვნელობა ვერ შეიცვალა. სცადეთ თავიდან.' });
      this.spinner.hide();
    });
  }





}
