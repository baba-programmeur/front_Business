import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCampagneApercuComponent } from './details-campagne-apercu.component';

describe('DetailsCampagneApercuComponent', () => {
  let component: DetailsCampagneApercuComponent;
  let fixture: ComponentFixture<DetailsCampagneApercuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCampagneApercuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCampagneApercuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
