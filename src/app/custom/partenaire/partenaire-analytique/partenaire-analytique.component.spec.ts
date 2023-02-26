import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenaireAnalytiqueComponent } from './partenaire-analytique.component';

describe('PartenaireAnalytiqueComponent', () => {
  let component: PartenaireAnalytiqueComponent;
  let fixture: ComponentFixture<PartenaireAnalytiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartenaireAnalytiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenaireAnalytiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
