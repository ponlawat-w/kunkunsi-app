import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricEditComponent } from './lyric-edit.component';

describe('LyricEditComponent', () => {
  let component: LyricEditComponent;
  let fixture: ComponentFixture<LyricEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyricEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LyricEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
