import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCampagneErrorComponent } from './details-campagne-error.component';

describe('DetailsCampagneErrorComponent', () => {
  let component: DetailsCampagneErrorComponent;
  let fixture: ComponentFixture<DetailsCampagneErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCampagneErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCampagneErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
