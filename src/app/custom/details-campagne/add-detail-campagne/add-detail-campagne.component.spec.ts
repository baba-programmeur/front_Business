import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailCampagneComponent } from './add-detail-campagne.component';

describe('AddDetailCampagneComponent', () => {
  let component: AddDetailCampagneComponent;
  let fixture: ComponentFixture<AddDetailCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDetailCampagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDetailCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
