import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCampagneComponent } from './details-campagne.component';

describe('DetailsCampagneComponent', () => {
  let component: DetailsCampagneComponent;
  let fixture: ComponentFixture<DetailsCampagneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCampagneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
