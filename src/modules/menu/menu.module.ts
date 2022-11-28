import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import {MenuModule as mModule} from 'primeng/menu';
import {StyleClassModule} from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [MenuItemComponent, MenuComponent],
  imports: [
    CommonModule,
    mModule,
    mModule,
    mModule,
    RouterModule,
    StyleClassModule,
    DividerModule,
  ],
  exports: [
    MenuComponent
  ]

})
export class MenuModule { }
