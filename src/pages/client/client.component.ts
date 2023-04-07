import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { ClientFormComponent } from './client-form/client-form.component';


@Component({
  selector: 'app-client-page',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [MessageService]
})

export class ClientComponent implements OnInit {
  public pageTitle: string = 'კლიენტი';
  public isLoading: boolean = false;
  public addPropertyButton = false;
  public attributes: MAttribute[] = [];
  public addPropertiesData: MProperty = new MProperty();
  private typeID = 0;
  public attrType: any = {
    'standard': 'სტანდარტული ატრიბუტები',
    'tree': 'ხისებრი ატრიბუტები',
    'entity': 'ობიექტი',
    1: 'standard',
    2: 'tree',
    3: 'entity'
  };

  // public filters: { [key: string]: number | string | null } = {
  //   'title': ''
  // };
 
  public isSidebarVisible: boolean = true;

  constructor(
    private attributesService: AttributesService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }


  public openDialog() {
    this.dialogService.open(ClientFormComponent, {
      width: '50%',
      position: 'top',
      header: 'კლიენტის დამატება',
    });
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
}
