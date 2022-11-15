import { Component, OnInit } from '@angular/core';
import { IMenuItem } from 'src/app/app.interfaces';
import { AttributesService } from 'src/services/Attributes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/AuthService.service';

// const MENU_ITEMS: IMenuItem[] = [
//   {
//     id: 1,
//     title: 'სისტემის მომხმარებლები',
//     img: 'client',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     }
//   },
//   {
//     id: 1,
//     title: 'კლიენტი',
//     img: 'client',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     }
//   },
//   {
//     id: 1,
//     title: 'ქეისი',
//     img: 'case',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     }
//   },
//   {
//     id: 1,
//     title: 'რეპორტინგი',
//     img: 'reports',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     }
//   },
//   {
//     id: 1,
//     title: 'მონაცემების მართვა',
//     img: 'setting',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     },
//     children: [
//       {
//         id: 1,
//         title: 'პროექტი',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 2,
//         title: 'დონორი',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 3,
//         title: 'ფილიალი',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 3,
//         title: 'პარტნიორი ორგანიზაციები',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 3,
//         title: 'ეროვნება',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 3,
//         title: 'განათლება',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 3,
//         title: 'ოჯახური მდგომარეობა',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//       {
//         id: 3,
//         title: 'ლოკაცია(ქვეყანა/რეგიონი/რაიონი)',
//         img: '',
//         action: '',
//         onClick: (router: Router) => {
//           router.navigate(['/manage/1']);
//         }
//       },
//     ],
//   },
//   {
//     id: 6,
//     title: 'პაროლის ცვლილება',
//     img: 'setting',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     }
//   },
//   {
//     id: 7,
//     title: 'გასვლა',
//     img: 'logout',
//     action: '',
//     onClick: (router: Router) => {
//       router.navigate(['/manage/1']);
//     }
//   },
// ];
@Component({
  selector: 'left-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // public items: IMenuItem[] = MENU_ITEMS as IMenuItem[];
  public items: IMenuItem[] = [];

  public attrs: any[] = [];

  constructor(
    private attrsService: AttributesService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    // this.items = MENU_ITEMS.map((attr) => this.asMenuItem(attr));
    this.items = [
      {
        id: 1,
        title: 'სისტემის მომხმარებლები',
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
        title: 'კლიენტი',
        img: 'client',
        active: this.isAttrPageActive(11),
        onClick: () => {
          console.log('HERE');
          window.location.href = '/manage/11';
        }
      },
      {
        id: 1,
        title: 'ქეისი',
        img: 'case',
        active: this.isAttrPageActive(12),
        onClick: () => {
          window.location.href = '/manage/12';
        }
      },
      {
        id: 1,
        title: 'რეპორტინგი',
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
        title: 'მონაცემების მართვა',
        img: 'setting',
        active: false,
        onClick: () => { },
        children: [
          {
            id: 1,
            title: 'პროექტი',
            img: '',
            active: this.isAttrPageActive(5),
            onClick: () => {
              window.location.href = '/manage/5';
            }
          },
          {
            id: 2,
            title: 'დონორი',
            img: '',
            active: this.isAttrPageActive(3),
            onClick: () => {
              window.location.href = '/manage/3';
            }
          },
          {
            id: 3,
            title: 'ფილიალი',
            img: '',
            active: this.isAttrPageActive(4),
            onClick: () => {
              window.location.href = '/manage/4';
            }
          },
          {
            id: 3,
            title: 'პარტნიორი ორგანიზაციები',
            img: '',
            active: this.isAttrPageActive(1),
            onClick: () => {
              window.location.href = '/manage/1';
            }
          },
          {
            id: 3,
            title: 'ეროვნება',
            img: '',
            active: this.isAttrPageActive(7),
            onClick: () => {
              window.location.href = '/manage/7';
            }
          },
          {
            id: 3,
            title: 'განათლება',
            img: '',
            active: this.isAttrPageActive(8),
            onClick: () => {
              window.location.href = '/manage/8';
            }
          },
          {
            id: 3,
            title: 'ოჯახური მდგომარეობა',
            img: '',
            active: this.isAttrPageActive(9),
            onClick: () => {
              window.location.href = '/manage/9';
            }
          },
          {
            id: 3,
            title: 'ლოკაცია(ქვეყანა/რეგიონი/რაიონი)',
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
        title: 'პაროლის ცვლილება',
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
        title: 'გასვლა',
        img: 'logout',
        active: false,
        onClick: () => {
          this.authService.logout();
        }
      },
    ];
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
