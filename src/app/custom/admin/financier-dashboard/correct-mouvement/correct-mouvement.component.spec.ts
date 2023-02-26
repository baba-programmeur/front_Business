import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectMouvementComponent } from './correct-mouvement.component';

describe('CorrectMouvementComponent', () => {
  let component: CorrectMouvementComponent;
  let fixture: ComponentFixture<CorrectMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
