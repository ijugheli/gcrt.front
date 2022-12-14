import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project';
  public menuExists: boolean = true;

  constructor(private activatedRoute: ActivatedRoute) {
    console.log(activatedRoute.snapshot);
    if (window.location.href.toString().indexOf('login') > -1) {
      this.menuExists = false;
    }
  }
}
