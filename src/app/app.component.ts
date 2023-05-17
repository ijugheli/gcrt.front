import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/services/app/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private appService: AppService
  ) {

  }

  ngOnInit() {
    this.appService.init();
  }
}
