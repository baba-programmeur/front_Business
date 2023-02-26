import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCampagneListComponent } from './details-campagne-list.component';

describe('DetailsCampagneListComponent', () => {
  let component: DetailsCampagneListComponent;
  let fixture: ComponentFixture<DetailsCampagneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCampagneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCampagneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
