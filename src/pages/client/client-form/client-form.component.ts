import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { IClient, IClientAttrs } from '../client.model';
import { calculateAge, getRouteParam } from 'src/app/app.func';
import { ClientService } from 'src/services/client.service';
import * as ClientConfig from '../client.config';
import { IFormMenuOption } from 'src/app/app.interfaces';
import { CaseService } from 'src/services/case.service';
import { MenuService } from 'src/services/app/menu.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss',],
  providers: [MessageService]
})

export class ClientFormComponent implements OnInit {
  public pageTitle: string = '';
  public client: IClient = new IClient();
  public clientID!: number | null;
  public ClientAttrs: IClientAttrs = new IClientAttrs();
  public menuOptions: IFormMenuOption[] = ClientConfig.menuOptions;
  public isLoading: boolean = false;
  public isDirty: boolean = false;
  public hasSocialSupport: boolean = false;
  public hasInsurance: boolean = false;
  public selectedSection: IFormMenuOption = ClientConfig.menuOptions[0];
  public todayDate!: Date;
  public id = getRouteParam('id');


  constructor(
    public clientService: ClientService,
    public caseService: CaseService,
    private messageService: MessageService,
    private attrService: AttributesService,
    public menuService: MenuService,
    public router: Router
  ) { }

  ngOnInit() {
    this.init();
  }

  public onSave(event: any): void {
    if (!this.clientService.validate()) {
      this.showMsg('შეავსეთ სავალდებულო ველები', 'error');
      return;
    }

    this.clientService.isValidationEnabled = false;
    this.clientService.isInputDisabled = true;
    this.clientService.store(this.client).subscribe({
      next: (data) => {
        if (typeof data.data !== 'undefined') {
          this.client = data.data;

          if (!this.clientID) {
            this.clientID = this.client.main.id;
            this.clientService.values.set('client_id', this.clientID);
            window.history.replaceState({}, '', `/client/edit/${this.clientID}`);
          }
        }

        this.showMsg(data.message, 'success');
      },
      error: (e) => {
        this.clientService.isInputDisabled = false;
        this.showMsg(e.error.message, 'error');
      },
      complete: () => {
        this.clientService.isInputDisabled = false;
        this.isDirty = false;
        this.caseService.initClients(true);
        this.initPageTitle();
      }
    });
  }

  public onUpdate(event: any): void {
    this.client.main.client_code = this.clientService.getClientCode();
    this.clientService.values.set('client_code', this.client.main.client_code);
    this.isDirty = true;
  }

  public onSelect(event: any): void {
    this.client.main.age = calculateAge(event);
    this.client.setAgeGroupID();
    this.clientService.values.set('age', this.client.main.age);
    this.clientService.values.set('age_group', this.client.main.age_group);
    this.onUpdate(event);
  }


  public shouldShowGenderInput() {
    const gender = this.clientService.values.get('gender');
    if (gender === undefined) return false;
    return this.attrService.getOptionTitle(gender as number).includes('სხვა');
  }

  private init(): void {
    this.clientService.values.clear();
    this.initClient();
  }

  private initClient(): void {
    if (!this.id) {
      this.pageTitle = 'კლიენტის დამატება';
      return
    };

    this.clientID = parseInt(this.id);
    this.isLoading = true;
    this.clientService.values.set('client_id', this.id);
    if (this.clientService.clients.has(this.clientID)) {
      this.client = this.clientService.clients.get(this.clientID)!;
      this.isLoading = false;
      this.initSwitchModels();
      this.initPageTitle();
    } else {
      this.clientService.show(this.clientID).subscribe({
        next: (data) => {
          this.client = new IClient(data.data);
          this.initSwitchModels();
        },
        error: (e) => {
          this.showMsg(e.error?.message ?? 'დაფიქსირდა შეცდომა', 'error');
          setTimeout(() => {
            this.router.navigate([`/client`]);
          }, 2000);
        },
        complete: () => {
          this.isLoading = false;
          this.initPageTitle();
        }
      });
    }
  }
  // hasInsurance and hasSocialSupport input switches for edit
  private initSwitchModels() {
    if (this.client.additional.has_insurance) {
      this.hasInsurance = true;
    }

    if (this.client.additional.has_social_support) {
      this.hasSocialSupport = true;
    }
  }

  private initPageTitle() {
    this.pageTitle = 'კლიენტის რედაქტირება - ' + this.client.main.client_code + ' ' + this.client.main.name + ' ' + this.client.main.surname;
  }

  private showMsg(msg: string, type: string): void {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }
}
