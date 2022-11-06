import { Component, OnInit } from '@angular/core';
import { AttributesService } from '../../services/Attributes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public views: any[] = [];
  public sections: any[] = [];

  constructor() {

  }

  ngOnInit() {
  }


}
