import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogShowComponent } from './log-show.component';

describe('LogShowComponent', () => {
  let component: LogShowComponent;
  let fixture: ComponentFixture<LogShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
