import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelMouvementComponent } from './cancel-mouvement.component';

describe('CancelMouvementComponent', () => {
  let component: CancelMouvementComponent;
  let fixture: ComponentFixture<CancelMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
