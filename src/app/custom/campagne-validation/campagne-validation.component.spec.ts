import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampagneValidationComponent } from './campagne-validation.component';

describe('CampagneComponent', () => {
  let component: CampagneValidationComponent;
  let fixture: ComponentFixture<CampagneValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampagneValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampagneValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
