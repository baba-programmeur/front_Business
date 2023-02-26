import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalEndpointComponent } from './canal-endpoint.component';

describe('CanalEndpointComponent', () => {
  let component: CanalEndpointComponent;
  let fixture: ComponentFixture<CanalEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanalEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
