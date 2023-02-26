import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireDataComponent } from './formulaire-data.component';

describe('FormulaireDataComponent', () => {
  let component: FormulaireDataComponent;
  let fixture: ComponentFixture<FormulaireDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
