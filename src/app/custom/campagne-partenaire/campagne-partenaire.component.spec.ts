import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagnePartenaireComponent } from './campagne-partenaire.component';

describe('CampagneComponent', () => {
  let component: CampagnePartenaireComponent;
  let fixture: ComponentFixture<CampagnePartenaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampagnePartenaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampagnePartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
