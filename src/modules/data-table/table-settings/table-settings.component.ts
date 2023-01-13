import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ACTION_SETTINGS } from 'src/app/app.config';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { FilterService } from 'primeng/api';
import { MProperty } from '../../../services/attributes/models/property.model';
import { DataTableService } from '../../../services/table.service';

@Component({
  selector: '[datatable-captions]',
  templateUrl: './table-settings.component.html',
  styleUrls: ['./table-settings.component.css'],
})
export class TableSettingsComponent implements OnInit {
  @Input('attribute') public attribute?: MAttribute;

  public columns?: MProperty[] = [];

  constructor(private filterService: FilterService, public table : DataTableService) { }

  ngOnInit() {
    this.columns = this.attribute?.columns;
  }

  public onSelectChange(prop: any) {

  }


}
