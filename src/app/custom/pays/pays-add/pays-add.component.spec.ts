import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaysAddComponent } from './pays-add.component';

describe('PaysAddComponent', () => {
  let component: PaysAddComponent;
  let fixture: ComponentFixture<PaysAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaysAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaysAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
