import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCritComponent } from './product-crit.component';

describe('ProductCritComponent', () => {
  let component: ProductCritComponent;
  let fixture: ComponentFixture<ProductCritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCritComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
