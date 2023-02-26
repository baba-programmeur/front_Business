import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireAddComponent } from './formulaire-add.component';

describe('FormulaireAddComponent', () => {
  let component: FormulaireAddComponent;
  let fixture: ComponentFixture<FormulaireAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
