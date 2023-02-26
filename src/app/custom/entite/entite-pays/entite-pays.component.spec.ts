import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitePaysComponent } from './entite-pays.component';

describe('EntitePaysComponent', () => {
  let component: EntitePaysComponent;
  let fixture: ComponentFixture<EntitePaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitePaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitePaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
