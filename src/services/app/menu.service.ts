import { Injectable } from '@angular/core';
import { AttributesService } from '../attributes/Attributes.service';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { UserService } from '../user.service';
import { MenuItem } from 'primeng/api';
import { MENU_ITEMS } from 'src/app/app.config';
import { MAttribute } from '../attributes/models/attribute.model';
import { SurveyService } from '../survey.service';


@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private pages: string[] = [
        'login',
        'forgot-password',
        'update-password',
        'otp'
    ];
    private items: any[] = [];
    public items$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
    public isMenuVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    constructor(
        private router: Router,
        private attrService: AttributesService,
        private userService: UserService,
        private surveyService: SurveyService
    ) {
        this.router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        ).subscribe((event) => {
            this.menuExists(event.url);
        })
    }

    public menuExists(url: string): void {
        this.isMenuVisible$.next(!this.pages.some((page) => url.indexOf(page) > - 1));
    }

    public hideMenu(): void {
        this.isMenuVisible$.next(false);
    }
    public showMenu(): void {
        this.isMenuVisible$.next(true);
    }

    public toggleMenu(): void {
        this.isMenuVisible$.next(!this.isMenuVisible$.getValue());
    }

    public loadMenuItems(): void {
        this.items = MENU_ITEMS;
        const user = this.userService.me();
        const index: number = this.items.findIndex((e: MenuItem) => e.title === 'user');
        this.items[index].label = `${user?.name} ${user?.lastname}`;
        this.attrService.getList().pipe(
            map((attrs) => attrs.filter((e) => e.status_id === true))
        ).subscribe((attrs) => {
            this.parseAttrs(attrs);
            // this.objects = attributeList.filter((i: any) => {
            //   return i['type'] == 3;
            // }).map(this.mapAttributeType);
        });

        this.surveyService.getSurveyList().subscribe((surveys) => {
            const list: any[] = surveys.menuItems.map((e) => this.mapSurveyItem(e));
            const index: number = this.items.findIndex((e: MenuItem) => e.label === 'კითხვარები');
            this.items[index].items = list;
            this.items$.next(this.items);
        });

    }

    private parseAttrs(attrs: MAttribute[]): void {
        const standardAttrs = attrs.filter((i: any) => {
            return i['type'] == 1;
        }).map((e) => this.mapAttributeType(e));
        const treeAttrs = attrs.filter((i: any) => {
            return i['type'] == 2;
        }).map((e) => this.mapAttributeType(e));

        const index: number = this.items.findIndex((e: MenuItem) => e.label == 'პარამეტრები');
        const isAttrExpanded: boolean = this.items[index].items[0]?.expanded ?? false;
        const isTreeExpanded: boolean = this.items[index].items[1]?.expanded ?? false;

        this.items[index].items = [
            {
                label: 'სტანდარტული ატრიბუტები',
                icon: 'pi pi-fw pi-list',
                expanded: isAttrExpanded,
                items: standardAttrs
            },
            {
                label: 'მრავალდონიანი ატრიბუტები',
                icon: 'pi pi-fw pi-sitemap',
                expanded: isTreeExpanded,
                items: treeAttrs
            }];
        this.items = [...this.items];
        this.items$.next(this.items);
    }

    private mapSurveyItem(item: any) {
        return {
            label: item.title,
            routerLink: `/survey/${item.id}`,
            routerLinkActive: { exact: true }
        };
    }

    private mapAttributeType(attr: MAttribute) {
        return {
            label: attr.title,
            badge: attr.count,
            badgeStyleClass: 'menu-count inline-flex align-items-center justify-content-center ml-auto bg-teal-500 text-0 border-circle font-medium',
            routerLink: `/manage/${attr.id}`,
            routerLinkActive: { exact: true }
        };
    }
}
