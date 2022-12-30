/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TreeselectInputComponent } from './treeselect-input.component';

describe('TreeselectInputComponent', () => {
  let component: TreeselectInputComponent;
  let fixture: ComponentFixture<TreeselectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeselectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeselectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
