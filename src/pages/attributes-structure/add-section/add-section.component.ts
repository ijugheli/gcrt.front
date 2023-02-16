import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IResponse } from 'src/app/app.interfaces';
import { ATTR_TYPE_NAME } from 'src/app/app.config';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { IProperty } from 'src/services/attributes/interfaces/property.interface';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['../dialog.component.css'],
  providers: [MessageService]
})

export class AddSectionComponent implements OnInit {

  public validation: boolean = false;
  public values: { [key: string]: string | number | boolean } = {
    'attr_id': 0,
    'title': '',
  };

  public actionTitle: string = 'სექციის დამატება';


  constructor(
    private spinner: NgxSpinnerService,
    private attrService: AttributesService,
    private messageService: MessageService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.values['attr_id'] = parseInt(this.dialogConfig.data?.attrID) || 0;
  }

  public isValidValue(key: string) {
    if (!this.validation) {
      return true;
    }

    return this.values[key] != null && this.values[key] != '';
  }

  private handleSubmit() {
    this.spinner.show();

    this.attrService
      .addSection(this.values)
      .subscribe((data) => {
        this.spinner.hide();

        const response: IResponse = data;

        this.showSuccess(response.message);

        setTimeout(() => {
          this.dialogRef.close(true);
        }, 500);
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
      console.log('VALIDATION ERROR');
      setTimeout(() => {
        this.validation = false;
      }, 2500);
      return;
    }

    this.handleSubmit();
  }
}
