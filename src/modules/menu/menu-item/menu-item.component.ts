import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMenuItem } from 'src/app/app.interfaces';

@Component({
  selector: 'menu-item[item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
})
export class MenuItemComponent implements OnInit {
  @Input() item!: IMenuItem;
  public attrID: any;
  public active: boolean = false;
  public dropdownOpened: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.attrID = this.route.snapshot.paramMap.get('attr_id');
    if (this.attrID == null) {
      return;
    }

    if (this.attrID == this.item.id) {
      this.active = true;
    }
  }

  public hasChildren() {
    return this.item != null && this.item.children != null && this.item.children.length > 0;
  }

  public toggleDropdown() {
    this.dropdownOpened = !this.dropdownOpened;
  }


}
