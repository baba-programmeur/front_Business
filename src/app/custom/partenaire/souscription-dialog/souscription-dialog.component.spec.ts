import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionDialogComponent } from './souscription-dialog.component';

describe('SouscriptionDialogComponent', () => {
  let component: SouscriptionDialogComponent;
  let fixture: ComponentFixture<SouscriptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SouscriptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SouscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
