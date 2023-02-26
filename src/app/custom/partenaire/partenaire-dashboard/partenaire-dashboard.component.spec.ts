import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenaireDashboardComponent } from './partenaire-dashboard.component';

describe('PartenaireDashboardComponent', () => {
  let component: PartenaireDashboardComponent;
  let fixture: ComponentFixture<PartenaireDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartenaireDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenaireDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
