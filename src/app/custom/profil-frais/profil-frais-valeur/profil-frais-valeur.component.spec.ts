import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilFraisValeurComponent } from './profil-frais-valeur.component';

describe('ProfilFraisValeurComponent', () => {
  let component: ProfilFraisValeurComponent;
  let fixture: ComponentFixture<ProfilFraisValeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilFraisValeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilFraisValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
