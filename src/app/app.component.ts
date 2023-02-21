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
  private pages: string[] = [
    'login',
    'forgot-password',
    'update-password',
    'otp'
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    const url = window.location.href.toString();

    console.log(activatedRoute.snapshot);

    if (!this.pages.some((page) => page == url)) {
      this.menuExists = false;
    }
  }


}
