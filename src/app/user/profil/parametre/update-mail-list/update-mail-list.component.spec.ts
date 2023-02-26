import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMailListComponent } from './update-mail-list.component';

describe('UpdateMailListComponent', () => {
  let component: UpdateMailListComponent;
  let fixture: ComponentFixture<UpdateMailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateMailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
