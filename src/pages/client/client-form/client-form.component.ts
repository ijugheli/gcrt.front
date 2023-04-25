import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { Client, ClientAttrs } from '../client.model';
import { calculateAge } from 'src/app/app.func';
import { ClientService } from 'src/services/client.service';

import * as ClientConfig from '../client.config';
import { IFormMenuOption } from 'src/app/app.interfaces';
import { CaseService } from 'src/services/case.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss',],
  providers: [MessageService]
})

export class ClientFormComponent implements OnInit {
  public pageTitle: string = 'კლიენტის დამატება';
  public client: Client = new Client();
  public clientID!: number | null;
  public ClientAttrs: ClientAttrs = new ClientAttrs();
  public menuOptions: IFormMenuOption[] = ClientConfig.menuOptions;
  public isLoading: boolean = false;
  public hasSocialSupport: boolean = false;
  public hasInsurance: boolean = false;
  public selectedSection: IFormMenuOption = ClientConfig.menuOptions[0];
  public todayDate!: Date;
  constructor(
    public clientService: ClientService,
    public caseService: CaseService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private attrService: AttributesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.init();
  }

  public onSave(event: any): void {
    if (!this.clientService.validate()) return;
    this.clientService.isValidationEnabled = false;
    this.clientService.isInputDisabled = true;

    this.clientService.store(this.client).subscribe({
      next: (data) => this.showSuccess(data.message),
      error: (e) => {
        this.clientService.isInputDisabled = false;
        this.showError(e.error.message);
      },
      complete: () => {
        this.clientService.isInputDisabled = false;
        this.caseService.initClients(true);
      }
    });
  }

  public onUpdate(event: any): void {
    this.client.main.client_code = this.clientService.getClientCode();
  }

  public onSelect(event: any): void {
    this.client.main.age = calculateAge(event);
    this.client.setAgeGroupID();
    this.clientService.values.set('age', this.client.main.age);
    this.clientService.values.set('age_group', this.client.main.age_group);
    this.onUpdate(event);
  }


  private init(): void {
    this.clientService.values.clear();
    this.initClient();
  }

  private initClient(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== undefined && id !== null) {
      this.clientID = parseInt(id);
      this.isLoading = true;

      if (this.clientService.clients.has(this.clientID)) {
        this.client = this.clientService.clients.get(this.clientID)!;
        this.isLoading = false;
      } else {
        this.clientService.show(this.clientID).subscribe({
          next: (data) => {
            this.client = data.data!
          },
          error: (e) => {
            this.showError(e.error.message);
            setTimeout(() => {
              this.router.navigate([`/client`]);
            }, 2000);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
      this.pageTitle = 'კლიენტის რედაქტირება';
      this.clientService.values.set('client_id', id);
    }
  }
  private showSuccess(msg: string): void {
    this.messageService.add({
      severity: 'success',
      summary: msg,
    });
  }

  private showError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: error,
    });
  }
}
