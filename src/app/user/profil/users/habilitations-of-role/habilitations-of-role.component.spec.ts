import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitationsOfRoleComponent } from './habilitations-of-role.component';

describe('HabilitationsOfRoleComponent', () => {
  let component: HabilitationsOfRoleComponent;
  let fixture: ComponentFixture<HabilitationsOfRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitationsOfRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitationsOfRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
