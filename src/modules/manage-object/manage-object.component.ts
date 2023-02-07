import { Component, Input, OnInit } from '@angular/core';
import { MAttribute } from 'src/services/attributes/models/attribute.model';

@Component({
  selector: 'manage-object',
  templateUrl: './manage-object.component.html',
  styleUrls: ['./manage-object.component.css']
})
export class ManageObjectComponent implements OnInit {
  @Input('attribute') public attribute?: MAttribute;
  @Input('valueID') public valueID?: number;


  public selectedPanel: any = null;
  public options: any[] = [];
  public recordID?: number;
  constructor() { }

  ngOnInit() {

    this.initOptions();


  }

  private initOptions() {
    if (!this.attribute) {
      return;
    }

    this.options = [
      { 'id' : 0, 'label': 'მონაცემები', 'disabled': false },
    ];

    if (this.attribute.hasChildren()) {
      this.attribute.children.forEach((child: MAttribute) => {
        // this.options.push({ 'id' : this.attribute?.id, 'label': child.title, 'disabled': this.recordID === undefined });
        this.options.push({ 'id' : child.id, 'label': child.title, 'disabled': false });
      });
      console.log(this.options);
    }
  }

}


