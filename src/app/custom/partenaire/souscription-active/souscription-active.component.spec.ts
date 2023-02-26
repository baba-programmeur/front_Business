import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionActiveComponent } from './souscription-active.component';

describe('SouscriptionDialogComponent', () => {
  let component: SouscriptionActiveComponent;
  let fixture: ComponentFixture<SouscriptionActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SouscriptionActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SouscriptionActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
