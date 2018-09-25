import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubImporterComponent } from './github-importer.component';

describe('GithubImporterComponent', () => {
  let component: GithubImporterComponent;
  let fixture: ComponentFixture<GithubImporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubImporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
