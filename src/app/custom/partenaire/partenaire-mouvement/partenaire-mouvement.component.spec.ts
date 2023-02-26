import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenaireMouvementComponent } from './partenaire-mouvement.component';

describe('PartenaireMouvementComponent', () => {
  let component: PartenaireMouvementComponent;
  let fixture: ComponentFixture<PartenaireMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartenaireMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenaireMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
