import { Component, Input, OnInit } from '@angular/core';
import { MAttribute } from 'src/services/attributes/models/attribute.model';
import { MOption } from 'src/services/attributes/models/option.model';
import { MProperty } from 'src/services/attributes/models/property.model';
import { DataTableService } from 'src/services/table.service';

@Component({
  selector: '[datatable-filters]',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.css']
})
export class TableFiltersComponent implements OnInit {
  @Input('attribute') public attribute?: MAttribute;

  public selected : MOption[] = [];

  public columns?: MProperty[] = [];

  constructor(public table : DataTableService) { }

  ngOnInit() {
    this.columns = this.attribute?.columns;
    console.log('From Table Filters');
    console.log(this.attribute);
    console.log('From Table Filters');
  }
  public onSelectChange(prop: any) {

  }

}
