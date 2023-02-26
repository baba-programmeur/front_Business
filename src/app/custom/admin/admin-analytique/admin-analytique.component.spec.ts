import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnalytiqueComponent } from './admin-analytique.component';

describe('AdminAnalytiqueComponent', () => {
  let component: AdminAnalytiqueComponent;
  let fixture: ComponentFixture<AdminAnalytiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAnalytiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnalytiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
