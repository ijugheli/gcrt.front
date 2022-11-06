import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [MenuItemComponent, MenuComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MenuComponent
  ]

})
export class MenuModule { }
