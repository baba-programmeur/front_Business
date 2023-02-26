import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationEndpointComponent } from './configuration-endpoint.component';

describe('CanalEndpointComponent', () => {
  let component: ConfigurationEndpointComponent;
  let fixture: ComponentFixture<ConfigurationEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
