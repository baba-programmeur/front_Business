import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMouvementComponent } from './confirm-mouvement.component';

describe('ConfirmMouvementComponent', () => {
  let component: ConfirmMouvementComponent;
  let fixture: ComponentFixture<ConfirmMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
