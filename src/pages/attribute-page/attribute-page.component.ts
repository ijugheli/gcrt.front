import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { first, map, Observable, of, switchMap } from 'rxjs';
import { getRouteParam } from 'src/app/app.func';
import { MenuService } from 'src/services/app/menu.service';

@Component({
  selector: 'attribute-page',
  templateUrl: './attribute-page.component.html',
  styleUrls: ['./attribute-page.component.css']
})
export class AttributePageComponent implements OnInit {
  public attrID: any = getRouteParam('attr_id');;

  // public attrID : any;
  // public navigationEnd : Observable<NavigationEnd>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public menuService: MenuService,

  ) {

  }

  ngOnInit() {
    // this.attrID = this.navigationEnd.pipe(
    //   map(() => this.route.root),
    //   map(root => root.firstChild),
    //   switchMap(firstChild => {
    //     if(firstChild && firstChild.firstChild) {
    //       const targetRoute = firstChild.firstChild;
    //       return targetRoute.paramMap.pipe(map(paramMap => paramMap.get('attr_id')))
    //     } else {
    //       return of(null);
    //     }
    //   })

    // )
  }

}

