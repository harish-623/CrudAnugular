import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishRideComponent } from './publish-ride.component';

describe('PublishRideComponent', () => {
  let component: PublishRideComponent;
  let fixture: ComponentFixture<PublishRideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishRideComponent]
    });
    fixture = TestBed.createComponent(PublishRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
