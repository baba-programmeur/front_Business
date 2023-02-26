import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCanalReceptionAddComponent } from './type-canal-reception-add.component';

describe('TypeCanalReceptionAddComponent', () => {
  let component: TypeCanalReceptionAddComponent;
  let fixture: ComponentFixture<TypeCanalReceptionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeCanalReceptionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeCanalReceptionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
