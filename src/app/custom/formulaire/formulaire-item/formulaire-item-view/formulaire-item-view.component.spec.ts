import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireItemViewComponent } from './formulaire-item-view.component';

describe('FormulaireItemViewComponent', () => {
  let component: FormulaireItemViewComponent;
  let fixture: ComponentFixture<FormulaireItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
