import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementIndividuelComponent } from './paiement-individuel.component';

describe('PaiementIndividuelComponent', () => {
  let component: PaiementIndividuelComponent;
  let fixture: ComponentFixture<PaiementIndividuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementIndividuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementIndividuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
