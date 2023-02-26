import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordFinishComponent } from './reset-password-finish.component';

describe('ResetPasswordFinishComponent', () => {
  let component: ResetPasswordFinishComponent;
  let fixture: ComponentFixture<ResetPasswordFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
