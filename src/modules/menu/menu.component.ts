import { Component, OnInit } from '@angular/core';
import { IMenuItem } from 'src/app/app.interfaces';
import { AttributesService } from 'src/services/Attributes.service';

const MENU_ITEMS: IMenuItem[] = [
  {
    id : 1,
    title: 'მომხმარებლები',
    img: 'client',
    action: '',
  },
  {
    id : 2,
    title: 'კლიენტი',
    img: 'client',
    action: '',
  },
  {
    id : 3,
    title: 'ქეისი',
    img: 'case',
    action: '',
  },
  {
    id  : 4,
    title: 'ადმინისტრირება',
    img: 'setting',
    action: '',
    children: [
      {
        id : 1,
        title: 'პროექტები',
        img: '',
        action: '',
      },
      {
        id : 2,
        title: 'რეგიონები',
        img: '',
        action: '',
      },
      {
        id : 3,
        title: 'ფილიალები',
        img: '',
        action: '',
      },
    ],
  },
  {
    id : 5,
    title: 'რეპორტები',
    img: 'reports',
    action: '',
  },
  {
    id : 6,
    title: 'პაროლის ცვლილება',
    img: 'setting',
    action: '',
  },
  {
    id : 7,
    title: 'გასვლა',
    img: 'logout',
    action: '',
  },
];

@Component({
  selector: 'left-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // public items: IMenuItem[] = MENU_ITEMS as IMenuItem[];
  public items: IMenuItem[] = [];

  public attrs: any[] = [];

  constructor(private attrsService: AttributesService,) {
  }

  ngOnInit(): void {
    this.attrsService.list().subscribe((d) => {
      this.attrs = d;
      this.items = this.attrs.map((attr) => {
        return {
          id : attr.id,
          title: attr.title,
          img: '',
          action: '/manage/' + attr.id,
        } as IMenuItem;
      });
    });
  }
}
