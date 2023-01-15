import { Component, Input, OnInit } from '@angular/core';
import { AttributesService } from 'src/services/attributes/Attributes.service';
import { RecordsService } from 'src/services/attributes/Records.service';
import { MRecord } from '../../../services/attributes/models/record.model';
import { MAttribute } from '../../../services/attributes/models/attribute.model';
import { DataTableService } from 'src/services/table.service';

@Component({
  selector: 'datatable-table-display',
  templateUrl: './table-display.component.html',
  styleUrls: ['./table-display.component.css']
})
export class TableDisplayComponent implements OnInit {
  @Input('attribute') public attribute?: MAttribute;

  constructor(
    public table: DataTableService,
  ) {

  }

  ngOnInit() {
    if (this.attribute)
      this.table.init(this.attribute?.id);
  }


}
