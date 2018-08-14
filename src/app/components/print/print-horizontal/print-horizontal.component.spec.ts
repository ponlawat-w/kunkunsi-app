import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHorizontalComponent } from './print-horizontal.component';

describe('PrintHorizontalComponent', () => {
  let component: PrintHorizontalComponent;
  let fixture: ComponentFixture<PrintHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
