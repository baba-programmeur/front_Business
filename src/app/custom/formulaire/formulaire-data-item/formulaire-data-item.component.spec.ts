import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireDataItemComponent } from './formulaire-data-item.component';

describe('FormulaireDataItemComponent', () => {
  let component: FormulaireDataItemComponent;
  let fixture: ComponentFixture<FormulaireDataItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireDataItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireDataItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
