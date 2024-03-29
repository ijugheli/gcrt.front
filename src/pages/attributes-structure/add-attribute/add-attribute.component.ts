import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { APIResponse } from 'src/app/app.interfaces';
import { ATTR_TYPE_NAME } from 'src/app/app.config';
import { AttributesService } from 'src/services/attributes/Attributes.service';

@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['../dialog.component.css'],
  providers: [MessageService]
})

export class AddAttributeComponent implements OnInit {

  public validation: boolean = false;
  public values: { [key: string]: string | number | boolean } = {
    'p_id': 0,
    'type': 1,
    'status_id': true,
    'title': '',
    'is_lazy': false,
  };

  public types: { [key: number]: string } = {
    1: 'სტანდარტული ატრიბუტი',
    2: 'ხისებრი ატრიბუტი',
    3: 'ობიექტი',
  };

  public type!: number;
  public actionTitle: string = 'დამატება';


  constructor(
    private spinner: NgxSpinnerService,
    private attrService: AttributesService,
    private messageService: MessageService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.type = parseInt(this.dialogConfig.data?.type) || 1;
    this.actionTitle = this.types[this.type] + 'ს დამატება';
  }

  public isValidValue(key: string) {
    if (!this.validation) {
      return true;
    }

    return this.values[key] != null && this.values[key] != '';
  }

  private handleSubmit() {
    this.values['is_lazy'] = this.values['is_lazy'] ? 1 : 0;
    this.values['status_id'] = this.values['status_id'] ? 1 : 0;

    this.spinner.show();

    this.attrService
      .add(this.values)
      .subscribe((data) => {
        this.spinner.hide();

        const response: APIResponse = data;

        this.showSuccess(response.message);

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      }, (error) => {
        this.spinner.hide();

        this.showError(error.error.message);
      });
  }

  public getAttrTypeName(name: string | number): string {
    return ATTR_TYPE_NAME(name) as string;
  }

  private showSuccess(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
  }

  private showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: error,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.validation = true;

    if (!this.isValidValue('title')) {
      setTimeout(() => {
        this.validation = false;
      }, 2500);
      return;
    }

    this.handleSubmit();
  }
}
