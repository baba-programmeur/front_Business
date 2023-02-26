import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireItemComponent } from './formulaire-item.component';

describe('FormulaireItemComponent', () => {
  let component: FormulaireItemComponent;
  let fixture: ComponentFixture<FormulaireItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
