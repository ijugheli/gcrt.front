import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/services/AuthService.service';
import { MenuService } from 'src/services/app/menu.service';

@Component({
  standalone: true,
  selector: 'left-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, DividerModule, PanelMenuModule, StyleClassModule]
})
export class MenuComponent implements OnInit, OnDestroy {
  public items: any[] = [];
  public isMenuVisible: boolean = true;
  private onDestroy$: Subject<any> = new Subject();

  constructor(
    private menuService: MenuService,
    public authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.menuService.loadMenuItems();
    this.menuService.isMenuVisible$.pipe(takeUntil(this.onDestroy$)).subscribe((isMenuVisible) => this.isMenuVisible = isMenuVisible);
    this.menuService.items$.pipe(takeUntil(this.onDestroy$)).subscribe((items) => this.items = items);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  public toggleMenu() {
    this.menuService.toggleMenu();
  }
}
