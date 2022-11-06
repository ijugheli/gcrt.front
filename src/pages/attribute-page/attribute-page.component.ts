import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { first, map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'attribute-page',
  templateUrl: './attribute-page.component.html',
  styleUrls: ['./attribute-page.component.css']
})
export class AttributePageComponent implements OnInit {
  public attrID: any;

  // public attrID : any;
  // public navigationEnd : Observable<NavigationEnd>;
  
  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.attrID = this.route.snapshot.paramMap.get('attr_id');
    
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

