import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalytiqueComponent } from './analytique.component';

describe('AnalytiqueComponent', () => {
  let component: AnalytiqueComponent;
  let fixture: ComponentFixture<AnalytiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalytiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalytiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
