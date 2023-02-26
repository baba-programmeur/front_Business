import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitationsComponent } from './habilitations.component';

describe('HabilitationsComponent', () => {
  let component: HabilitationsComponent;
  let fixture: ComponentFixture<HabilitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
