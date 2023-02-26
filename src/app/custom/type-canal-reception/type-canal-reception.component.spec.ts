import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCanalReceptionComponent } from './type-canal-reception.component';

describe('TypeCanalReceptionComponent', () => {
  let component: TypeCanalReceptionComponent;
  let fixture: ComponentFixture<TypeCanalReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeCanalReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeCanalReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
