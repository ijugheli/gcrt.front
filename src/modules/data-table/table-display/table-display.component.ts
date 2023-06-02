import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAttribute } from '../../../services/attributes/models/attribute.model';
import { DataTableService } from 'src/services/table.service';
import * as _ from 'lodash';

@Component({
  selector: 'datatable-table-display',
  templateUrl: './table-display.component.html',
  styleUrls: ['./table-display.component.css']
})
export class TableDisplayComponent implements OnInit, OnChanges {
  @Input('attribute') public attribute?: MAttribute;

  constructor(
    public table: DataTableService,
  ) {

  }

  ngOnInit() {
    if (this.attribute)
      this.table.init(this.attribute?.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!_.isEqual(changes['attribute'].currentValue, changes['attribute'].previousValue)) {
      this.table.init(this.attribute?.id!);
    }
  }
}
