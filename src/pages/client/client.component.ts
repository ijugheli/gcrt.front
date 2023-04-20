import { Component, OnInit } from '@angular/core';
import { MAttribute } from '../../services/attributes/models/attribute.model';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { MProperty } from 'src/services/attributes/models/property.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/services/client.service';
import { Client, ClientAdditional, ClientAddress, ClientContact, ClientMain } from './client.model';
import { mainList } from './client-attrs/client.main';
import { additionalList } from './client-attrs/client.additional';
import { contactList } from './client-attrs/client.contact';
import { addressList } from './client-attrs/client.address';
import * as ClientConfig from './client.config';
import { APIResponse } from 'src/app/app.interfaces';


@Component({
  selector: 'app-client-page',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [MessageService]
})

export class ClientComponent implements OnInit {
  public pageTitle: string = 'კლიენტი';
  public isLoading: boolean = false;
  public selectedRow!: Client;
  public data: Client[] = [];
  public loadingArray: number[] = Array(10);

  public isSidebarVisible: boolean = false;
  public sidebarData!: any;
  public sidebarCols: any;

  constructor(
    public attrService: AttributesService,
    private messageService: MessageService,
    private router: Router,
    public clientService: ClientService,
    public confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.init();
  }

  private init(): void {
    this.isLoading = true;
    this.clientService.index().subscribe({
      next: (data) => this.setData(data),
      error: (e) => { },
      complete: () => this.isLoading = false
    });
  }

  public onEditClick(): void {
    if (this.selectedRow != undefined) {
      this.router.navigate([`/client/edit/${this.selectedRow.main.id}`]);
    }
  }

  public onAddClick(): void {
    this.router.navigate(['/client/add']);
  }

  public onDeleteClick(): void {
    this.confirmationService.confirm({
      header: 'ჩანაწერის წაშლა',
      acceptLabel: 'კი',
      rejectLabel: 'გაუქმება',
      message: 'დარწმუნებული ხართ რომ გსურთ არჩეული ჩანაწერის წაშლა?',
      accept: () => {
        this.clientService.destroy(this.selectedRow.main.id!).subscribe({
          next: (data) => {
            this.setData(data);
            this.showSuccess(data.message);
          },
          error: (e: any) => this.showError(e.error.message),
          complete: () => { }
        });
      }, reject: () => {

      }
    });

  }


  private setData(data: APIResponse<Client[]>): void {
    if (data.data !== undefined) {
      this.clientService.mapClients(data.data);
      this.data = Array.from(this.clientService.clients.values());
    }
  }

  public onDetailClick(type: number, data: any): void {
    this.sidebarData = data;
    const types: Record<number, string> = ClientConfig.detailTypes;

    switch (types[type]) {
      case 'main':
        this.sidebarCols = mainList;
        break;
      case 'additional':
        this.sidebarCols = additionalList;
        break;
      case 'contact':
        this.sidebarCols = contactList;
        break;
      default:
        this.sidebarCols = addressList;
        break;
    }
    this.isSidebarVisible = true;
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
