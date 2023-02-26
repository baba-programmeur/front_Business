import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilFraisComponent } from './profil-frais.component';

describe('ProfilFraisComponent', () => {
  let component: ProfilFraisComponent;
  let fixture: ComponentFixture<ProfilFraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilFraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
