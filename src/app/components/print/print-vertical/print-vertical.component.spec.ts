import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVerticalComponent } from './print-vertical.component';

describe('PrintVerticalComponent', () => {
  let component: PrintVerticalComponent;
  let fixture: ComponentFixture<PrintVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintVerticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
