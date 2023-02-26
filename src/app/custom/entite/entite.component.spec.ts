import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntiteComponent } from './entite.component';

describe('EntiteComponent', () => {
  let component: EntiteComponent;
  let fixture: ComponentFixture<EntiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
