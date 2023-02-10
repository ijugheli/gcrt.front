import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IResponse } from 'src/app/app.interfaces';
import { ATTR_TYPE_NAME } from 'src/app/app.config';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { IProperty } from 'src/services/attributes/interfaces/property.interface';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { IAttribute } from 'src/services/attributes/interfaces/attribute.interface';
@Component({
  selector: 'app-add-section-property',
  templateUrl: './add-section-property.component.html',
  styleUrls: ['../dialog.component.css'],
  providers: [MessageService]
})

export class AddSectionPropertyComponent implements OnInit {

  public validation: boolean = false;

  public sectionProperty: { [key: string]: any } = {
    'p_id': 0,
    'attr_id': 0,
    'source_attr_id': 0,
    'type': 1,
    'title': null,
    'input_data_type': 0,
    'input_view_type': 0,
    'is_mandatory': 1,
    'has_filter': 1,
    'is_primary': 0,
    'order_id': 0,
  };


  public types: { [key: number]: string } = {
    1: 'სტანდარტული ატრიბუტი',
    2: 'ხისებრი ატრიბუტი',
    3: 'ობიექტი',
  };

  public viewTypesMap: any = {
    1: { name: 'input', id: 1, title: 'სტანდარტული ტექსტი' },
    2: { name: 'textarea', id: 2, title: 'გრძელი ტექსტი' },
    // 3 : {name : 'editable-textarea', id : 3,title : 'editable-textarea'},
    // 4 : {name : 'checkbox', id : 4, title : 'checkbox'},
    5: { name: 'toggle', id: 5, title: 'კი/არა' },
    6: { name: 'select', id: 6, title: 'სარჩევი' },
    // 7 : {name : 'searchable-select', id : 7,title : 'searchable-select'},
    8: { name: 'multiselect', id: 8, title: 'მრავალმნიშვნელოვანი სარჩევი' },
    // 9 : {name : 'searchable-multiselect', id : 9, title : 'searchable-multiselect'},
    10: { name: 'datepicker', id: 10, title: 'თარიღის სარჩევი' },
    // 11 : {name : 'timepicker', id : 11, title : 'timepicker'},
    // 12 : {name : 'datetimepicker', id : 12, title : 'datetimepicker'},
    13: { name: 'treeselect', id: 13, title: 'ხისებრი სარჩევი' },
    // 14 : {name : 'tableselect', id : 14, title : 'tableselect'},
  };

  public dataTypesMap: any = {
    1: { name: 'string', id: 1, title: 'ტექსტი' },
    2: { name: 'int', id: 2, title: 'მთელი რიცხვი' },
    3: { name: 'double', id: 3, title: 'წილადი რიცხვი' },
    4: { name: 'date', id: 4, title: 'თარიღი' },
    5: { name: 'boolean', id: 5, title: 'კი/არა' },
  };

  public dropdownStyle = { "width": "100%", "height": "100%" };
  public attrSources: any;
  public dataTypes: any;
  public viewTypes: any;

  public attrTitle: string = '';
  public property!: MProperty | undefined;
  public attrID!: number;
  public actionTitle: string = 'დამატება';


  constructor(
    private spinner: NgxSpinnerService,
    private attrService: AttributesService,
    private messageService: MessageService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {

    this.init();
  }

  public isValueSelected(key: string) {
    if (!this.validation) {
      return true;
    }

    return this.sectionProperty[key] != null && this.sectionProperty[key] != 0;
  }

  public isValidValue(key: string) {
    if (!this.validation) {
      return true;
    }

    return this.sectionProperty[key] != null && this.sectionProperty[key] != '';
  }




  public onCancel() {
    this.dialogRef.close();
  }

  public onSubmit() {
    this.validation = true;

    if (!this.validate()) {
      setTimeout(() => {
        this.validation = false;
      }, 2500);
      return;
    }

    this.handleSubmit();
  }

  private handleSubmit() {
    this.spinner.show();

    this.attrService
      .addSectionProperty(this.sectionProperty)
      .subscribe((data) => {
        const response: IResponse = data;
        const responseData = response.data as IProperty[];

        let result: MAttribute | null;

        if (response.code == 0) return this.showError(response.message);

        this.showSuccess(response.message);

        if (responseData != null) {
          result = this.attrService.updateSectionProperties(responseData, this.sectionProperty['attr_id']);
        }

        setTimeout(() => {
          this.dialogRef.close(result);
        }, 500);
      }, (error) => {
        this.showError('დაფიქსირდა შეცდომა');
      });
  }
  private init() {
    this.dataTypes = Object.values(this.dataTypesMap);
    this.viewTypes = Object.values(this.viewTypesMap);

    this.attrID = this.dialogConfig.data?.attrID;
    this.property = this.dialogConfig.data?.property;
    this.attrSources = this.dialogConfig.data?.attrSources;

    this.sectionProperty['p_id'] = this.property?.id || 0;
    this.sectionProperty['attr_id'] = this.property?.attr_id || this.attrID;
    this.attrTitle = this.attrService.get(this.property?.attr_id || this.attrID)?.title!;
  }

  private showSuccess(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
    this.spinner.hide();
  }

  private showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: error,
      detail: 'გთხოვთ სცადოთ განსხვავებული პარამეტრები'
    });
    this.spinner.hide();
  }



  private validate() {
    return this.isValidValue('title') && this.isValueSelected('input_data_type') && this.isValueSelected('input_view_type');
  }
}
