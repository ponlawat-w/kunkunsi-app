import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalLyricsComponent } from './additional-lyrics.component';

describe('AdditionalLyricsComponent', () => {
  let component: AdditionalLyricsComponent;
  let fixture: ComponentFixture<AdditionalLyricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalLyricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
