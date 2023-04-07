import { Component, OnInit } from '@angular/core';
import { MProperty } from 'src/services/attributes/models/property.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  providers: [MessageService]
})

export class ClientFormComponent implements OnInit {
  public pageTitle: string = 'კლიენტის დამატება';
  public isLoading: boolean = false;
  public hasSocialSupport: boolean = false;
  public hasInsurance: boolean = false;
  public nationalitySources: any = [];
  public maritalStatusSources: any = [];
  public selectedNationality: any;
  public genderSources: any;
  public educationSources: any;
  public selectedEducation: any;
  public selectedGender: any;
  public selectedStatus: any;
  public selectedSection: any = { label: 'ძირითადი მახასიათებლები', value: 0, icon: 'pi pi-user' };
  public options: any = [
    { label: 'ძირითადი მახასიათებლები', value: 0, icon: 'pi pi-user' },
    { label: 'დამატებითი ინფორმაცია', value: 1, icon: 'pi pi-plus-circle' },
    { label: 'საკონტაქტო ინფორმაცია', value: 2, icon: 'pi pi-phone' },
    { label: 'სამისამართო ინფორმაცია', value: 3, icon: 'pi pi-map-marker' },
  ];

  public onOptionClick(event: any) {
    console.log(event);
    console.log(this.selectedSection);
  }
  public menuItems: MenuItem[] = [
    {
      label: 'HTML',
      items: [
        {
          label: 'HTML 1'
        },
        {
          label: 'HTML 2'
        }
      ]
    }];

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

  public filters: { [key: string]: number | string | null } = {
    'title': ''
  };
  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private attrService: AttributesService,
  ) { }

  ngOnInit() {
    this.nationalitySources = this.attrService.properties.get(168)?.source.options;
    this.maritalStatusSources = this.attrService.properties.get(169)?.source.options;
    this.genderSources = this.attrService.properties.get(167)?.source.options;
    this.educationSources = this.attrService.properties.get(195)?.source.options;
  }


  public onChange(event: any) {
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
