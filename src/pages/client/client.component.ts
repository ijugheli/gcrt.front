import { Component, OnInit } from '@angular/core';
import { AttributesService } from '../../services/attributes/Attributes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ClientService } from 'src/services/client.service';
import { IClient, MClient, ParsedClients } from './client.model';
import { mainCols, mainList } from './client-attrs/client.main';
import { additionalList } from './client-attrs/client.additional';
import { contactList } from './client-attrs/client.contact';
import { addressList } from './client-attrs/client.address';
import * as ClientConfig from './client.config';
import { APIResponse, ICaseCol, IFormMenuOption } from 'src/app/app.interfaces';
import { Clipboard } from '@angular/cdk/clipboard';
import { MenuService } from 'src/services/app/menu.service';

@Component({
  selector: 'app-client-page',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [MessageService]
})

export class ClientComponent implements OnInit {
  public pageTitle: string = 'კლიენტი';
  public isLoading: boolean = false;
  public selectedRow!: IClient | undefined | null;
  public clients: IClient[] = [];
  public clientID: number | null = null;
  public ClientConfig: any = ClientConfig;
  public parsedClients: MClient[] = [];
  public loadingArray: number[] = Array(10);
  public columns: ICaseCol[] = mainCols;
  public isSidebarVisible: boolean = false;
  public sidebarData!: any;
  public sidebarCols: any;
  public detailModel: number = ClientConfig.menuOptions[1].value;

  constructor(
    public attrService: AttributesService,
    private messageService: MessageService,
    private router: Router,
    public clientService: ClientService,
    public menuService: MenuService,
    public confirmationService: ConfirmationService,
    private clipboard: Clipboard,
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
        this.clientService.destroy(this.selectedRow!.main.id!).subscribe({
          next: (data) => {
            this.setData(data);
            this.showMsg(data.message, 'success');
            this.selectedRow = undefined;
          },
          error: (e: any) => this.showMsg(e.error.message, 'error'),
          complete: () => { }
        });
      },
    });
  }

  public onHideClick(): void {
    this.isSidebarVisible = false;
  }
  public onDetailClick(clientID: number): void {
    const oldID: number | null = this.clientID;
    this.clientID = clientID;
    this.sidebarData = this.clientService.parsedClients.get(this.clientID!)!['additional'];
    this.sidebarCols = additionalList;
    this.isSidebarVisible = oldID === clientID ? !this.isSidebarVisible : true;
  }

  public onDetailSelect(event: any) {
    const types: Record<number, string> = ClientConfig.detailTypes;
    this.sidebarData = this.clientService.parsedClients.get(this.clientID!)![types[event.value]];
    switch (types[event.value]) {
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
  }

  public copyToClipboard(text: string): void {
    this.clipboard.copy(text);
    this.messageService.clear();
    this.showMsg('წარმატებით დაკოპირდა', 'info');
  }

  private showMsg(msg: string, type: string): void {
    this.messageService.add({
      severity: type,
      summary: msg,
    });
  }

  private setData(data: APIResponse<ParsedClients>): void {
    if (data.data !== undefined) {
      this.clients = data.data.clients;
      this.parsedClients = data.data.parsedClients;
    }
  }
}
