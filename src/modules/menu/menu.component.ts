import { Component, OnInit } from '@angular/core';
import { IMenuItem } from 'src/app/app.interfaces';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/AuthService.service';
import { UserService } from 'src/services/user.service';
import { User } from 'src/app/app.models';

@Component({
  selector: 'left-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // public items: IMenuItem[] = MENU_ITEMS as IMenuItem[];
  public items: any[] = [];


  public objects: any[] = [];
  public trees: any[] = [];
  public attributes: any[] = [];

  public user : User | null = null;

  constructor(
    private attrsService: AttributesService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.user = this.userService.me();
    console.log(this.user);
    this.loadAttrs();

    // this.items = MENU_ITEMS.map((attr) => this.asMenuItem(attr));
    this.items = [
      {
        id: 1,
        label: 'სისტემის მომხმარებლები',
        img: 'client',
        active: ((): boolean => {
          return this.activatedRoute.snapshot.url.toString() == 'users';
        })(),
        onClick: () => {
          window.location.href = '/users';
        }
      },
      {
        id: 1,
        label: 'კლიენტი',
        img: 'client',
        active: this.isAttrPageActive(11),
        onClick: () => {
          window.location.href = '/manage/11';
        }
      },
      {
        id: 1,
        label: 'ქეისი',
        img: 'case',
        active: this.isAttrPageActive(12),
        onClick: () => {
          window.location.href = '/manage/12';
        }
      },
      {
        id: 1,
        label: 'რეპორტინგი',
        img: 'reports',
        active: ((): boolean => {
          return this.activatedRoute.snapshot.url.toString() == 'reports';
        })(),
        onClick: () => {
          window.location.href = '/reports';
        }
      },
      {
        id: 1,
        label: 'მონაცემების მართვა',
        img: 'setting',
        active: false,
        onClick: () => { },
        children: [
          {
            id: 1,
            label: 'პროექტი',
            img: '',
            active: this.isAttrPageActive(5),
            onClick: () => {
              window.location.href = '/manage/5';
            }
          },
          {
            id: 2,
            label: 'დონორი',
            img: '',
            active: this.isAttrPageActive(3),
            onClick: () => {
              window.location.href = '/manage/3';
            }
          },
          {
            id: 3,
            label: 'ფილიალი',
            img: '',
            active: this.isAttrPageActive(4),
            onClick: () => {
              window.location.href = '/manage/4';
            }
          },
          {
            id: 3,
            label: 'პარტნიორი ორგანიზაციები',
            img: '',
            active: this.isAttrPageActive(1),
            onClick: () => {
              window.location.href = '/manage/1';
            }
          },
          {
            id: 3,
            label: 'ეროვნება',
            img: '',
            active: this.isAttrPageActive(7),
            onClick: () => {
              window.location.href = '/manage/7';
            }
          },
          {
            id: 3,
            label: 'განათლება',
            img: '',
            active: this.isAttrPageActive(8),
            onClick: () => {
              window.location.href = '/manage/8';
            }
          },
          {
            id: 3,
            label: 'ოჯახური მდგომარეობა',
            img: '',
            active: this.isAttrPageActive(9),
            onClick: () => {
              window.location.href = '/manage/9';
            }
          },
          {
            id: 3,
            label: 'ლოკაცია(ქვეყანა/რეგიონი/რაიონი)',
            img: '',
            active: this.isAttrPageActive(10),
            onClick: () => {
              window.location.href = '/manage/10';
            }
          },
        ],
      },
      {
        id: 6,
        label: 'პაროლის ცვლილება',
        img: 'setting',
        active: ((): boolean => {
          return this.activatedRoute.snapshot.url.toString() == 'change-password';
        })(),
        onClick: () => {
          window.location.href = '/change-password';
        }
      },
      {
        id: 7,
        label: 'გასვლა',
        img: 'logout',
        active: false,
        onClick: () => {
          this.authService.logout();
        }
      },
    ];
  }

  public logout() {
    this.authService.logout();
  }

  private loadAttrs() {
    // this.attrsService.list().subscribe((response) => {})

    this.attrsService.list().subscribe((d) => {
      this.attributes = d.filter((i: any) => {
        return i['type'] == 1;
      }).map((attr) => {
        return {
          id: attr.id,
          count: attr.count,
          title: attr.title,
          action: '/manage/' + attr.id,
        };
      });

      this.trees = d.filter((i: any) => {
        return i['type'] == 2;
      }).map((attr) => {
        return {
          id: attr.id,
          title: attr.title,
          count: attr.count,
          action: '/manage/' + attr.id,
        };
      });

      this.objects = d.filter((i: any) => {
        return i['type'] == 3;
      }).map((attr) => {
        return {
          id: attr.id,
          title: attr.title,
          count: attr.count,
          action: '/manage/' + attr.id,
        };
      });
    });
  }

  private isAttrPageActive(attrID: number): boolean {
    let activatedAttrID: any = this.activatedRoute.snapshot.paramMap.get('attr_id');
    activatedAttrID = activatedAttrID == null ? null : parseInt(activatedAttrID);

    if (activatedAttrID == null) {
      return false;
    }

    if (attrID == activatedAttrID) {
      return true;
    }

    return false;
  }

  public navigate(attrID : number){
    window.location.href = '/manage/' + attrID; 
  }

  // private asMenuItem(attr: IMenuItem): IMenuItem {
  //   // return {
  //   //   id: attr.id,
  //   //   title: attr.title,
  //   //   img: attr.img,
  //   //   action: attr.action,
  //   //   onClick: () => attr.onClick(this.router),
  //   //   children: (attr.children != null
  //   //     ? attr.children.map((attr) => this.asMenuItem(attr))
  //   //     : null
  //   //   ) as IMenuItem[]
  //   // } as IMenuItem;
  // }



  // this.attrsService.list().subscribe((d) => {
  //   this.attrs = d;
  //   this.items = this.attrs.map((attr) => {
  //     return {
  //       id : attr.id,
  //       title: attr.title,
  //       img: '',
  //       action: '/manage/' + attr.id,
  //     } as IMenuItem;
  //   });
  // });
}
