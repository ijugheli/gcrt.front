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

  public selected?: MRecord;
  public rows: { [index: number]: string | string[] }[] = [];

  constructor(
    private records: RecordsService,
    public table: DataTableService,
  ) {

  }

  ngOnInit() {
    this.getRows();
  }

  private async getRows() {
    if (!this.attribute) {
      return;
    }

    this.rows = (await this.records.get(this.attribute.id)).map((i) => i.propValueMap);
  }

  public onRowSelect(e: any) {

  }

  public onRowUnselect(e: any) {

  }
}
