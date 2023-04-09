import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { APIResponse } from 'src/app/app.interfaces';
import { Attribute } from 'src/app/app.models';
import { ATTR_TYPES } from 'src/app/app.config';
import { Client, ClientMain, ICustomInput, ClientAttrs } from '../client.model';
import { calculateAge } from 'src/app/app.func';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss',],
  providers: [MessageService]
})

export class ClientFormComponent implements OnInit {
  public pageTitle: string = 'კლიენტის დამატება';
  public client: Client = new Client();
  public ClientAttrs: ClientAttrs = new ClientAttrs();
  public isLoading: boolean = false;
  public hasSocialSupport: boolean = false;
  public hasInsurance: boolean = false;
  public selectedSection: any = { label: 'ძირითადი მახასიათებლები', value: 0, icon: 'pi pi-user' };
  public options: any = [
    { label: 'ძირითადი მახასიათებლები', value: 0, icon: 'pi pi-user' },
    { label: 'დამატებითი ინფორმაცია', value: 1, icon: 'pi pi-plus-circle' },
    { label: 'საკონტაქტო ინფორმაცია', value: 2, icon: 'pi pi-phone' },
    { label: 'სამისამართო ინფორმაცია', value: 3, icon: 'pi pi-map-marker' },
  ];
  categoryTree: any;
  todayDate: any;

  treeselect = [
    {
      key: '0',
      label: 'კატეგორია1',
      data: 'კატეგორია 1',
      children: [
        {
          key: '0.0',
          label: 'Child1',
          data: 'Child1',
        },
        {
          key: '0.1',
          label: 'Child1',
          data: 'Child1',
        }
      ]
    },
  ];

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private attrService: AttributesService,
  ) { }

  ngOnInit() {
  }

  public onSelect(event: any) {
    this.client.main.age = calculateAge(event);
    this.client.setAgeGroupID();
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
