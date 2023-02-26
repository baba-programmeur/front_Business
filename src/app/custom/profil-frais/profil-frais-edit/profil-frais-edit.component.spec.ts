import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilFraisEditComponent } from './profil-frais-edit.component';

describe('ProfilFraisEditComponent', () => {
  let component: ProfilFraisEditComponent;
  let fixture: ComponentFixture<ProfilFraisEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilFraisEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilFraisEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
