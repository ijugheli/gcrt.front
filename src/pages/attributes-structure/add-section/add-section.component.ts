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
        const response: IResponse = data;
        const responseData = response.data as IProperty[];

        let result: MAttribute | null;

        if (response.code == 0) return this.showError(response.message);

        this.showSuccess(response.message);

        if (responseData != null) {
          result = this.attrService.updateSectionProperties(responseData, this.values['attr_id'] as number);
        }

        setTimeout(() => {
          this.dialogRef.close(result);
        }, 500);
      }, (error) => {
        console.log('ADD SECTION ERROR ////');
        console.log(error);
        console.log('ADD SECTION ERROR ////');

        this.showError('დაფიქსირდა შეცდომა');
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
