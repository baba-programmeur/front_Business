import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionAddComponent } from './souscription-add.component';

describe('SouscriptionAddComponent', () => {
  let component: SouscriptionAddComponent;
  let fixture: ComponentFixture<SouscriptionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SouscriptionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SouscriptionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
