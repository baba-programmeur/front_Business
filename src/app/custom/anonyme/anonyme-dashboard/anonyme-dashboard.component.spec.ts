import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymeDashboardComponent } from './anonyme-dashboard.component';

describe('AnonymeDashboardComponent', () => {
  let component: AnonymeDashboardComponent;
  let fixture: ComponentFixture<AnonymeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
