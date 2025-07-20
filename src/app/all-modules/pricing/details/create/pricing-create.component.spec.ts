import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingCreateComponent } from './pricing-create.component';

describe('PricingCreateComponent', () => {
  let component: PricingCreateComponent;
  let fixture: ComponentFixture<PricingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
