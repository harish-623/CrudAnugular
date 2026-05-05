import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRequestComponent } from './approve-request.component';

describe('ApproveRequestComponent', () => {
  let component: ApproveRequestComponent;
  let fixture: ComponentFixture<ApproveRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveRequestComponent]
    });
    fixture = TestBed.createComponent(ApproveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
