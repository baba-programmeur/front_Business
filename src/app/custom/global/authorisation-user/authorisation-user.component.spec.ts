import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationUserComponent } from './authorisation-user.component';

describe('AuthorisationUserComponent', () => {
  let component: AuthorisationUserComponent;
  let fixture: ComponentFixture<AuthorisationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorisationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorisationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
