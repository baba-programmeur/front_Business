import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalReceptionComponent } from './canal-reception.component';

describe('CanalReceptionComponent', () => {
  let component: CanalReceptionComponent;
  let fixture: ComponentFixture<CanalReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanalReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
