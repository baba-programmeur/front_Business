import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesOfUserComponent } from './roles-of-user.component';

describe('RolesOfUserComponent', () => {
  let component: RolesOfUserComponent;
  let fixture: ComponentFixture<RolesOfUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesOfUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesOfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
