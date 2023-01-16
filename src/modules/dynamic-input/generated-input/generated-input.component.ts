import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { AttributesService } from '../../../services/attributes/Attributes.service';

@Component({
  selector: '[generated-input]',
  templateUrl: './generated-input.component.html',
  styleUrls: ['./generated-input.component.css']
})
export class GeneratedInputComponent implements OnInit {
  public enabled = false;

  constructor(
    public form: FormService,
    public attributes: AttributesService) { 

    }

  ngOnInit() {
  }

}
