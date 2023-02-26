import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonbuttonComponent } from './monbutton.component';

describe('MonbuttonComponent', () => {
  let component: MonbuttonComponent;
  let fixture: ComponentFixture<MonbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
