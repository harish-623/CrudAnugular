import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPublishRidesComponent } from './driver-publish-rides.component';

describe('DriverPublishRidesComponent', () => {
  let component: DriverPublishRidesComponent;
  let fixture: ComponentFixture<DriverPublishRidesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverPublishRidesComponent]
    });
    fixture = TestBed.createComponent(DriverPublishRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
